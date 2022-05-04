const utils = require("../../utils/");

describe("utils", () => {
  describe(".ragStatus()", () => {
    const fourDays = 345600000;
    const overOneWeek = 604800001;

    test("no argument", () => {
      expect(utils.ragStatus()).toEqual({ elapsedDays: 0, state: "" });
    });

    test("red state", () => {
      expect(utils.ragStatus(new Date() - overOneWeek)).toEqual({
        elapsedDays: 7,
        state: "red",
      });
    });

    test("amber state", () => {
      expect(utils.ragStatus(new Date() - fourDays)).toEqual({
        elapsedDays: 4,
        state: "amber",
      });
    });

    test("green state", () => {
      expect(utils.ragStatus(new Date())).toEqual({
        elapsedDays: 0,
        state: "green",
      });
    });
  });

  describe(".acquirer()", () => {
    test("no argument", () => {
      expect(utils.acquirer()).toEqual({ acquirer: "", sortableAcquirer: "" });
    });

    test("mandatory", () => {
      expect(
        utils.acquirer({
          formType: "mandatory",
          q1iAcquirerOrRepresentative: "acquirer",
          q1iiAcquirerFullname: "Test user",
        })
      ).toEqual({ acquirer: "Test user", sortableAcquirer: "test user" });
    });

    test("retrospective", () => {
      expect(
        utils.acquirer({
          formType: "retrospective",
          q1iNotifyingPartyOrRepresentative: "notifyingParty",
          q1iiNotifyingPartyName: "Test user",
        })
      ).toEqual({ acquirer: "Test user", sortableAcquirer: "test user" });
    });

    test("voluntary", () => {
      expect(
        utils.acquirer({
          formType: "voluntary",
          q1iNotifyingPartyOrRepresentative: "notifyingParty",
          q1iiNotifyingPartyName: "Test user",
        })
      ).toEqual({ acquirer: "Test user", sortableAcquirer: "test user" });
    });
  });

  describe(".date()", () => {
    test("now", () => {
      const now = new Date();
      expect(utils.date(now)).toEqual(
        now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear()
      );
    });
  });

  describe(".sortableDate()", () => {
    test("no argument", () => {
      expect(utils.sortableDate()).toEqual("");
    });

    test("now", () => {
      const now = new Date();
      expect(utils.sortableDate(now)).toEqual(now.getTime());
    });
  });

  describe(".status()", () => {
    const status = {
      1: "In Progress",
      2: "Submitted",
      3: "Under Review",
      4: "Accepted",
      5: "Rejected",
      6: "Submitted - Pending Decision",
      7: "Request for Information",
    };

    test("no argument", () => {
      expect(utils.status()).toEqual("In Progress");
    });

    Object.keys(status).forEach((key) => {
      test("status - " + status[key], () => {
        expect(utils.status(key)).toEqual(status[key]);
      });
    });
  });
});
