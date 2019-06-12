# Automerge Mongo

A proof-of-concept hypermerge participant that takes automerge updates and sends them to mongodb, where documents can be indexed and queried (read-only).

## How to Run

### Prerequisites:

```
brew install nats-streaming-server
brew install mongodb
```

In one tab: `nats-streaming-server`

In another tab: `mongod --config /usr/local/etc/mongod.conf`

### Download & Run automerge-mongo:

```
git clone https://github.com/canadaduane/automerge-mongo
cd automerge-mongo
yarn install
yarn start
```

## What is Hypermerge?

[Hypermerge]() is the networking layer between a user's local changes (like [neat-input](https://github.com/mafintosh/neat-input) in this case) and [Automerge](https://github.com/automerge/automerge). It makes it easy to use [CRDTs](https://arxiv.org/abs/1608.03960) in an application, so that collaborative operations are guaranteed to converge on a single state shared among viewers.

## Thanks

Thanks to @pvh and others on the hypermerge/automerge team for help with issues & teaching me how this all works. Also thanks to Derek Collison & Synadia for building a simple, cloud-native alternative to Kafka (i.e. `NATS` and `nats-streaming-server`).


