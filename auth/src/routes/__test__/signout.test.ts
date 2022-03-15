import request from "supertest";
import {app} from "../../app";


it('should remove cookies after sign out', async function () {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@gmail.com",
            password: "password"
        }).expect(200);

    const response = await request(app)
        .get("/api/users/signout")
        .expect(200)
    expect(response.get("Set-Cookie")[0]).toBe("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
});
