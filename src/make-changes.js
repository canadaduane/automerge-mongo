import Automerge from "automerge";
import uuid from "uuid";
import Debug from "debug";
import Timeout from "await-timeout";

import nats from "node-nats-streaming";

const DEFAULT_DOC_URI =
  "hypermerge:/BuxxncK49tXe1fwTvDt8Hh4iwGgMDMZEPf9LLP9Yy1zG";
const docUri = process.env.DOC_URI || DEFAULT_DOC_URI;
const me = uuid();
const discoveryUrl = "wss://discovery-cloud.herokuapp.com";

const log = Debug("mongo-sync");
const river = nats.connect("test-cluster", me);

const publishChange = change => {
  river.publish("changes", JSON.stringify(change), (err, guid) => {
    if (err) {
      console.error("failed to publish change:", err);
    } else {
      log("changed:", guid, change);
    }
  });
};

river.on("connect", async () => {
  await Timeout.set(1000);
  publishChange({ sample: "change1" });

  await Timeout.set(1000);
  publishChange({ sample: "change2" });

  // Long wait!
  await Timeout.set(1000000);
});

river.on("close", () => {
  process.exit();
});
