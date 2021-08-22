//! The OpenLifter live scoreboard server.

use openlifter_server::openlifter::*;

#[macro_use]
extern crate rocket;

use rocket::serde::json::Json;

#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;

#[get("/")]
async fn hello() -> &'static str {
    "Hello, world!"
}

#[post("/", data = "<input>")]
async fn update(input: Json<GlobalState>) -> &'static str {
    dbg!(input);
    "got it!"
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![hello, update])
}
