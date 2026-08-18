import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("Health check", () => {
  it("confirma conectividade real com o banco, não só um status estático", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.db).toEqual(expect.objectContaining({ status: "ok" }));
    expect(typeof res.body.db.latencyMs).toBe("number");
    expect(typeof res.body.uptimeSeconds).toBe("number");
    expect(typeof res.body.timestamp).toBe("string");
  });
});
