import { Repo } from "hypermerge";
import Automerge from "automerge";
import storage from "random-access-memory";
import DiscoverySwarm from "discovery-cloud-client";
import uuid from "uuid";
import Debug from "debug";

import { MongoClient } from "mongodb";
import nats from "node-nats-streaming";

let handle;
let document = {};

const MONGO_URL = "mongodb://localhost/automerge";
const DEFAULT_DOC_URI =
  "hypermerge:/BuxxncK49tXe1fwTvDt8Hh4iwGgMDMZEPf9LLP9Yy1zG";
const docUri = process.env.DOC_URI || DEFAULT_DOC_URI;
const me = uuid();
const discoveryUrl = "wss://discovery-cloud.herokuapp.com";

const log = Debug("mongo-sync");
const river = nats.connect("test-cluster", me);

river.on("connect", () => {
  river.publish(
    "mongo-sync",
    JSON.stringify({
      online: true
    }),
    (err, guid) => {
      if (err) {
        console.error("Publish failed:", err);
      } else {
        log("Online:", guid);
      }
    }
  );

  var subscription = river.subscribe("changes", msg => {
    console.log("Received change:", msg.getSequence(), msg.getData());
  });

  setTimeout(() => {
    subscription.unsubscribe();
    subscription.on("unsubscribed", () => river.close());
  }, 1000000);
});

river.on("close", () => {
  process.exit();
});

const repo = new Repo({ storage, port: 0 });

const openUri = _docUri => {
  if (handle) handle.close();
  log("Opening document:", docUri);
  handle = repo.open(_docUri);
  handle.subscribe(newDoc => {
    const keys = Object.keys(newDoc);
    log("Change Event:", keys.length, "keys");
    // document = newDoc;
    MongoClient.connect(MONGO_URL, (err, db) => {
      keys.forEach(key => {
        const value = newDoc[key];
        const query = { _id: key };
        db.collection.replaceOne(query, value, { upsert: true });
      });
    });
  });
};

// Set up the Hypermerge documents
const swarm = new DiscoverySwarm({
  url: discoveryUrl,
  id: repo.back.id,
  stream: repo.back.stream
});

repo.replicate(swarm);
const text = new Automerge.Text();
// openUri(repo.create({ text, collaborators: {} }));
openUri(docUri);

// Kick off first render
// render();
