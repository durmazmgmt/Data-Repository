import test from "node:test"
import assert from "node:assert/strict"
import { validatePublicRows } from "./build-public-snapshot.mjs"

test("accepts a unique sanitized public row", () => {
  const rows = [{
    key: "durmaz-holdings",
    name: "Durmaz Holdings LLC",
    recordType: "entity",
    status: "active",
    tags: ["portfolio"],
    updatedAt: 1789502228937,
  }]
  assert.deepEqual(validatePublicRows(rows), rows)
})

test("rejects duplicate keys", () => {
  const row = { key: "same", name: "A", recordType: "entity", status: "active", tags: [], updatedAt: 1 }
  assert.throws(() => validatePublicRows([row, { ...row, name: "B" }]), /duplicate key/i)
})

test("rejects restricted fields", () => {
  const row = {
    key: "durmaz-holdings",
    name: "Durmaz Holdings LLC",
    recordType: "entity",
    status: "active",
    tags: [],
    updatedAt: 1,
    contentJson: "{}",
  }
  assert.throws(() => validatePublicRows([row]), /blocked field/i)
})
