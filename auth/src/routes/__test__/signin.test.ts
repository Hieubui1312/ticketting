import {app} from "../../app";
import request from "supertest";


it("fails when email not exist", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(400)
})

it("fails when password is not correct", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200)

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "pass"
        }).expect(400)
})

it('should set cookies when sign in successful', async function () {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200)

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200)

    expect(response.get("Set-Cookie")).toBeDefined()
});
