#define _GNU_SOURCE
#include <dirent.h>
#include <errno.h>
#include <fcntl.h>
#include <limits.h>
#include <linux/landlock.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <sys/types.h>
#include <sys/utsname.h>
#include <sys/wait.h>
#include <unistd.h>

#ifndef SYS_landlock_create_ruleset
#ifdef __NR_landlock_create_ruleset
#define SYS_landlock_create_ruleset __NR_landlock_create_ruleset
#else
#error "Landlock syscall numbers are unavailable in these headers"
#endif
#endif
#ifndef SYS_landlock_add_rule
#ifdef __NR_landlock_add_rule
#define SYS_landlock_add_rule __NR_landlock_add_rule
#else
#error "Landlock syscall numbers are unavailable in these headers"
#endif
#endif
#ifndef SYS_landlock_restrict_self
#ifdef __NR_landlock_restrict_self
#define SYS_landlock_restrict_self __NR_landlock_restrict_self
#else
#error "Landlock syscall numbers are unavailable in these headers"
#endif
#endif

#define POLICY_REVISION "twinglass-landlock-fixture-v1"

struct agent_result {
    int policy_ok;
    int policy_errno;
    int own_read;
    int own_write;
    int own_create;
    int own_list;
    int sibling_read_denied;
    int sibling_write_denied;
    int sibling_list_denied;
    int sibling_stat_visible;
};

static int ll_create_ruleset(const struct landlock_ruleset_attr *attr,
                             size_t size, uint32_t flags) {
    return (int)syscall(SYS_landlock_create_ruleset, attr, size, flags);
}

static int ll_add_path_rule(int ruleset_fd,
                            const struct landlock_path_beneath_attr *attr) {
    return (int)syscall(SYS_landlock_add_rule, ruleset_fd,
                        LANDLOCK_RULE_PATH_BENEATH, attr, 0);
}

static int ll_restrict_self(int ruleset_fd) {
    return (int)syscall(SYS_landlock_restrict_self, ruleset_fd, 0);
}

static uint64_t handled_fs_for_abi(int abi) {
    uint64_t handled =
        LANDLOCK_ACCESS_FS_EXECUTE |
        LANDLOCK_ACCESS_FS_WRITE_FILE |
        LANDLOCK_ACCESS_FS_READ_FILE |
        LANDLOCK_ACCESS_FS_READ_DIR |
        LANDLOCK_ACCESS_FS_REMOVE_DIR |
        LANDLOCK_ACCESS_FS_REMOVE_FILE |
        LANDLOCK_ACCESS_FS_MAKE_CHAR |
        LANDLOCK_ACCESS_FS_MAKE_DIR |
        LANDLOCK_ACCESS_FS_MAKE_REG |
        LANDLOCK_ACCESS_FS_MAKE_SOCK |
        LANDLOCK_ACCESS_FS_MAKE_FIFO |
        LANDLOCK_ACCESS_FS_MAKE_BLOCK |
        LANDLOCK_ACCESS_FS_MAKE_SYM;
#ifdef LANDLOCK_ACCESS_FS_REFER
    if (abi >= 2)
        handled |= LANDLOCK_ACCESS_FS_REFER;
#endif
#ifdef LANDLOCK_ACCESS_FS_TRUNCATE
    if (abi >= 3)
        handled |= LANDLOCK_ACCESS_FS_TRUNCATE;
#endif
#ifdef LANDLOCK_ACCESS_FS_IOCTL_DEV
    if (abi >= 5)
        handled |= LANDLOCK_ACCESS_FS_IOCTL_DEV;
#endif
#ifdef LANDLOCK_ACCESS_FS_RESOLVE_UNIX
    if (abi >= 9)
        handled |= LANDLOCK_ACCESS_FS_RESOLVE_UNIX;
#endif
    return handled;
}

static int apply_policy(const char *own_dir, int abi) {
    struct landlock_ruleset_attr ruleset_attr = {
        .handled_access_fs = handled_fs_for_abi(abi),
    };
    int ruleset_fd = ll_create_ruleset(&ruleset_attr, sizeof(ruleset_attr), 0);
    if (ruleset_fd < 0)
        return -1;

    int own_fd = open(own_dir, O_PATH | O_CLOEXEC);
    if (own_fd < 0) {
        int saved = errno;
        close(ruleset_fd);
        errno = saved;
        return -1;
    }

    struct landlock_path_beneath_attr own_rule = {
        .allowed_access = ruleset_attr.handled_access_fs,
        .parent_fd = own_fd,
    };
    if (ll_add_path_rule(ruleset_fd, &own_rule) < 0) {
        int saved = errno;
        close(own_fd);
        close(ruleset_fd);
        errno = saved;
        return -1;
    }

    if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) < 0) {
        int saved = errno;
        close(own_fd);
        close(ruleset_fd);
        errno = saved;
        return -1;
    }

    if (ll_restrict_self(ruleset_fd) < 0) {
        int saved = errno;
        close(own_fd);
        close(ruleset_fd);
        errno = saved;
        return -1;
    }

    close(own_fd);
    close(ruleset_fd);
    return 0;
}

static int join_path(char *dst, size_t dst_size,
                     const char *dir, const char *name) {
    int n = snprintf(dst, dst_size, "%s/%s", dir, name);
    return n > 0 && (size_t)n < dst_size ? 0 : -1;
}

static int read_file_ok(const char *path) {
    char byte;
    int fd = open(path, O_RDONLY | O_CLOEXEC);
    if (fd < 0)
        return 0;
    ssize_t n = read(fd, &byte, 1);
    close(fd);
    return n == 1;
}

static int append_file_ok(const char *path) {
    static const char marker[] = "x";
    int fd = open(path, O_WRONLY | O_APPEND | O_CLOEXEC);
    if (fd < 0)
        return 0;
    ssize_t n = write(fd, marker, sizeof(marker) - 1);
    close(fd);
    return n == (ssize_t)(sizeof(marker) - 1);
}

static int create_file_ok(const char *path) {
    int fd = open(path, O_WRONLY | O_CREAT | O_EXCL | O_CLOEXEC, 0600);
    if (fd < 0)
        return 0;
    close(fd);
    return 1;
}

static int list_dir_ok(const char *path) {
    DIR *dir = opendir(path);
    if (!dir)
        return 0;
    (void)readdir(dir);
    closedir(dir);
    return 1;
}

static int read_file_denied(const char *path) {
    errno = 0;
    int fd = open(path, O_RDONLY | O_CLOEXEC);
    if (fd >= 0) {
        close(fd);
        return 0;
    }
    return errno == EACCES;
}

static int append_file_denied(const char *path) {
    errno = 0;
    int fd = open(path, O_WRONLY | O_APPEND | O_CLOEXEC);
    if (fd >= 0) {
        close(fd);
        return 0;
    }
    return errno == EACCES;
}

static int list_dir_denied(const char *path) {
    errno = 0;
    DIR *dir = opendir(path);
    if (dir) {
        closedir(dir);
        return 0;
    }
    return errno == EACCES;
}

static int stat_visible(const char *path) {
    struct stat st;
    return stat(path, &st) == 0;
}

static int write_full(int fd, const void *buf, size_t len) {
    const unsigned char *p = buf;
    while (len > 0) {
        ssize_t n = write(fd, p, len);
        if (n < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        p += (size_t)n;
        len -= (size_t)n;
    }
    return 0;
}

static int read_full(int fd, void *buf, size_t len) {
    unsigned char *p = buf;
    while (len > 0) {
        ssize_t n = read(fd, p, len);
        if (n == 0)
            return -1;
        if (n < 0) {
            if (errno == EINTR)
                continue;
            return -1;
        }
        p += (size_t)n;
        len -= (size_t)n;
    }
    return 0;
}

static void run_agent(const char *own_dir, const char *sibling_dir,
                      int abi, int start_fd, int result_fd) {
    struct agent_result result;
    memset(&result, 0, sizeof(result));

    char token;
    if (read_full(start_fd, &token, 1) < 0)
        _exit(120);

    if (apply_policy(own_dir, abi) < 0) {
        result.policy_errno = errno;
        (void)write_full(result_fd, &result, sizeof(result));
        _exit(0);
    }
    result.policy_ok = 1;

    char own_seed[PATH_MAX];
    char own_created[PATH_MAX];
    char sibling_seed[PATH_MAX];
    if (join_path(own_seed, sizeof(own_seed), own_dir, "session.txt") < 0 ||
        join_path(own_created, sizeof(own_created), own_dir, "created.txt") < 0 ||
        join_path(sibling_seed, sizeof(sibling_seed), sibling_dir, "session.txt") < 0) {
        result.policy_errno = ENAMETOOLONG;
        (void)write_full(result_fd, &result, sizeof(result));
        _exit(0);
    }

    result.own_read = read_file_ok(own_seed);
    result.own_write = append_file_ok(own_seed);
    result.own_create = create_file_ok(own_created);
    result.own_list = list_dir_ok(own_dir);
    result.sibling_read_denied = read_file_denied(sibling_seed);
    result.sibling_write_denied = append_file_denied(sibling_seed);
    result.sibling_list_denied = list_dir_denied(sibling_dir);

    /* Landlock intentionally does not restrict stat(2)-class metadata lookup. */
    result.sibling_stat_visible = stat_visible(sibling_seed);

    (void)write_full(result_fd, &result, sizeof(result));
    _exit(0);
}

static int seed_file(const char *dir) {
    char path[PATH_MAX];
    if (join_path(path, sizeof(path), dir, "session.txt") < 0) {
        errno = ENAMETOOLONG;
        return -1;
    }
    int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC | O_CLOEXEC, 0600);
    if (fd < 0)
        return -1;
    static const char seed[] = "private-session";
    int ok = write_full(fd, seed, sizeof(seed) - 1);
    int saved = errno;
    close(fd);
    errno = saved;
    return ok;
}

static int agent_pass(const struct agent_result *r) {
    return r->policy_ok &&
           r->own_read &&
           r->own_write &&
           r->own_create &&
           r->own_list &&
           r->sibling_read_denied &&
           r->sibling_write_denied &&
           r->sibling_list_denied;
}

static void cleanup_agent_dir(const char *dir) {
    char path[PATH_MAX];
    if (join_path(path, sizeof(path), dir, "session.txt") == 0)
        unlink(path);
    if (join_path(path, sizeof(path), dir, "created.txt") == 0)
        unlink(path);
    rmdir(dir);
}

static void print_agent_json(const char *name, const struct agent_result *r) {
    printf("{\"agent\":\"%s\",\"policy_ok\":%s,\"policy_errno\":%d,"
           "\"own_read\":%s,\"own_write\":%s,\"own_create\":%s,\"own_list\":%s,"
           "\"sibling_read_denied\":%s,\"sibling_write_denied\":%s,"
           "\"sibling_list_denied\":%s,\"sibling_stat_visible\":%s}",
           name,
           r->policy_ok ? "true" : "false",
           r->policy_errno,
           r->own_read ? "true" : "false",
           r->own_write ? "true" : "false",
           r->own_create ? "true" : "false",
           r->own_list ? "true" : "false",
           r->sibling_read_denied ? "true" : "false",
           r->sibling_write_denied ? "true" : "false",
           r->sibling_list_denied ? "true" : "false",
           r->sibling_stat_visible ? "true" : "false");
}

int main(void) {
    struct utsname uts;
    if (uname(&uts) < 0)
        strcpy(uts.release, "unknown");

    errno = 0;
    int abi = ll_create_ruleset(NULL, 0, LANDLOCK_CREATE_RULESET_VERSION);
    if (abi < 1) {
        int saved = errno;
        printf("{\"schema\":\"twinglass.landlock_isolation_probe.v1\","
               "\"claim_status\":\"DEMO\",\"status\":\"UNSUPPORTED\","
               "\"policy_revision\":\"%s\",\"kernel_release\":\"%s\","
               "\"landlock_abi\":null,\"uid\":%ld,\"euid\":%ld,"
               "\"errno\":%d}\n",
               POLICY_REVISION, uts.release,
               (long)getuid(), (long)geteuid(), saved);
        return 77;
    }

    char root_template[] = "/tmp/twinglass-landlock-XXXXXX";
    char *root = mkdtemp(root_template);
    if (!root) {
        perror("mkdtemp");
        return 2;
    }

    char agent_a[PATH_MAX];
    char agent_b[PATH_MAX];
    if (join_path(agent_a, sizeof(agent_a), root, "agent-a") < 0 ||
        join_path(agent_b, sizeof(agent_b), root, "agent-b") < 0) {
        fprintf(stderr, "fixture path too long\n");
        rmdir(root);
        return 2;
    }
    if (mkdir(agent_a, 0700) < 0 || mkdir(agent_b, 0700) < 0 ||
        seed_file(agent_a) < 0 || seed_file(agent_b) < 0) {
        perror("fixture setup");
        cleanup_agent_dir(agent_a);
        cleanup_agent_dir(agent_b);
        rmdir(root);
        return 2;
    }

    int start_pipe[2];
    int result_a[2];
    int result_b[2];
    if (pipe(start_pipe) < 0 || pipe(result_a) < 0 || pipe(result_b) < 0) {
        perror("pipe");
        cleanup_agent_dir(agent_a);
        cleanup_agent_dir(agent_b);
        rmdir(root);
        return 2;
    }

    pid_t a = fork();
    if (a == 0) {
        close(start_pipe[1]);
        close(result_a[0]);
        close(result_b[0]);
        close(result_b[1]);
        run_agent(agent_a, agent_b, abi, start_pipe[0], result_a[1]);
    }
    if (a < 0) {
        perror("fork agent-a");
        return 2;
    }

    pid_t b = fork();
    if (b == 0) {
        close(start_pipe[1]);
        close(result_b[0]);
        close(result_a[0]);
        close(result_a[1]);
        run_agent(agent_b, agent_a, abi, start_pipe[0], result_b[1]);
    }
    if (b < 0) {
        perror("fork agent-b");
        return 2;
    }

    close(start_pipe[0]);
    close(result_a[1]);
    close(result_b[1]);

    const char start_tokens[2] = {'A', 'B'};
    if (write_full(start_pipe[1], start_tokens, sizeof(start_tokens)) < 0) {
        perror("start barrier");
        return 2;
    }
    close(start_pipe[1]);

    struct agent_result ra;
    struct agent_result rb;
    int read_ok = read_full(result_a[0], &ra, sizeof(ra)) == 0 &&
                  read_full(result_b[0], &rb, sizeof(rb)) == 0;
    close(result_a[0]);
    close(result_b[0]);

    int status_a = 0;
    int status_b = 0;
    waitpid(a, &status_a, 0);
    waitpid(b, &status_b, 0);

    int pass = read_ok &&
               WIFEXITED(status_a) && WEXITSTATUS(status_a) == 0 &&
               WIFEXITED(status_b) && WEXITSTATUS(status_b) == 0 &&
               agent_pass(&ra) && agent_pass(&rb);

    printf("{\"schema\":\"twinglass.landlock_isolation_probe.v1\","
           "\"claim_status\":\"DEMO\",\"status\":\"%s\","
           "\"policy_revision\":\"%s\",\"kernel_release\":\"%s\","
           "\"landlock_abi\":%d,\"uid\":%ld,\"euid\":%ld,\"agents\":[",
           pass ? "PASS" : "FAIL",
           POLICY_REVISION,
           uts.release,
           abi,
           (long)getuid(),
           (long)geteuid());
    print_agent_json("A", &ra);
    printf(",");
    print_agent_json("B", &rb);
    printf("],\"claim_boundary\":"
           "\"fixture-only; real CLI runtime validation is still required for MEASURED\","
           "\"known_limitation\":"
           "\"stat(2)-class sibling metadata may remain visible; pre-opened file descriptors are outside this fixture\"}\n");

    cleanup_agent_dir(agent_a);
    cleanup_agent_dir(agent_b);
    rmdir(root);

    return pass ? 0 : 1;
}
