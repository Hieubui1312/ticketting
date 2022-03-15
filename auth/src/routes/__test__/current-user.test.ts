import request from "supertest";
import {app} from "../../app";

it('should response with detail current user', async function () {
    const cookies = await global.signin();

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookies)
        .expect(200)

    expect(response.body.currentUser.email).toEqual( "test@gmail.com")
});

it('should expected null with not authenticated', async function () {
    const response = await request(app)
        .get("/api/users/currentuser")
        .expect(200)
    expect(response.body.currentUser).toEqual(null)
});
