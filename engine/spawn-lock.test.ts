import assert from "node:assert/strict";
import test from "node:test";
import { diverge, openMain } from "./main-lattice.ts";

const skip = { skip: "AGENT-5: implement spawn lock (improper + other-track), then unskip" };

test("spawn refuses: no improper-track evidence", skip, () => {
  const m = openMain("spawn-lock");
  assert.throws(
    () =>
      diverge(m, m.legs[0].id, {
        cannotFollow: "other math",
        functionSet: "friction",
        necessaryBecause: "different tax",
      } as never),
    /improper/i,
  );
});

test("spawn refuses: other-track is a synonym of the live lane", skip, () => {
  assert.fail("implement synonym refuse");
});

test("spawn allows: improper + other-track, parent keeps walking", skip, () => {
  assert.fail("implement allow path");
});
