import request from "supertest";
import {app} from "../../app";


it("returns a 201 on successful sign up", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: "hello@gmail.com",
            password: "hieu@1312"
        }).expect(200)
})

it("return a 400 when missing email or password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({})
        .expect(400)
})

it('should return 400 when email or password incorrect', async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "hieubui",
            password: "hieu"
        }).expect(400)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "hieu@gmail.com",
            password: "h"
        }).expect(400)
});

it("disallow duplicate email", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200)

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(400)
})

it("Set cookies after sign up", async () => {
    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200)
    expect(response.get("Set-Cookie")).toBeDefined()
})
