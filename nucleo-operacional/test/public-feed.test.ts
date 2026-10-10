import assert from "node:assert/strict";
import test from "node:test";
import { fetchPublicFeed, isPublicIpv4Address, validatePublicFeedUrl } from "../src/public-feed.js";

test("permits globally routable IPv4 and rejects special-purpose ranges", () => {
  assert.equal(isPublicIpv4Address("8.8.8.8"), true);
  assert.equal(isPublicIpv4Address("1.1.1.1"), true);
  for (const address of [
    "0.0.0.1", "10.0.0.1", "100.64.0.1", "127.0.0.1", "169.254.1.1",
    "172.16.0.1", "172.31.255.254", "192.0.2.1", "192.168.1.1",
    "198.18.0.1", "198.51.100.1", "203.0.113.1", "224.0.0.1", "255.255.255.255", "::1",
  ]) {
    assert.equal(isPublicIpv4Address(address), false, `${address} must not be accepted`);
  }
});

test("accepts only HTTPS public-feed URL syntax", () => {
  assert.equal(validatePublicFeedUrl("https://example.gov.br/feed.xml").hostname, "example.gov.br");
  for (const url of [
    "http://example.gov.br/feed.xml",
    "https://user:password@example.gov.br/feed.xml",
    "https://localhost/feed.xml",
    "https://source.local/feed.xml",
    "https://127.0.0.1/feed.xml",
    "https://192.168.1.2/feed.xml",
  ]) {
    assert.throws(() => validatePublicFeedUrl(url), `${url} must be rejected`);
  }
});

test("does not make a network request for a private literal address", async () => {
  await assert.rejects(fetchPublicFeed("https://127.0.0.1/feed.xml"), /not public|público/i);
});