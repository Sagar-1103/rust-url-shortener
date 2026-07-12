use axum::{
    Router,
};

mod config;
mod router;

use crate::router::create_router;
use crate::config::env::ENV;

async fn serve(app:Router, port:u16) {
    let addr = std::net::SocketAddr::from(([127,0,0,1],port));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("Server running on port {port}");
    axum::serve(listener,app).await.unwrap();
}

#[tokio::main]
async fn main() {
    let port = ENV.port;
    let app = create_router();
    serve(app, port).await;
}