use axum::{Json, extract::State, http::StatusCode};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, EntityTrait, IntoActiveModel};
use serde::{Deserialize};

use crate::{entities::{prelude::*,url::{self, Model}}, state::AppState, utils::{ApiResult, auth::Claims, error::ApiError, image::fetch_image, response::ApiResponse}};

#[derive(Deserialize)]
pub struct ShortenUrl {
    url: String,
}

pub async fn shorten_url(claims: Claims,State(state):State<AppState>,Json(payload):Json<ShortenUrl>) -> ApiResult<Model> {
    let code = nanoid::nanoid!(8);

    let created_url = url::ActiveModel {
        user_id: Set(claims.user_id),
        original_url: Set(payload.url),
        code: Set(code),
        ..Default::default()
    };

    let shortened_url = created_url.insert(&state.db).await.map_err(|_| ApiError::Internal)?;

    let db = state.db.clone();
    let url_id = shortened_url.id;
    let target_url = shortened_url.original_url.clone();

    tokio::spawn( async move {
        let image_response = fetch_image(&target_url).await;

        match image_response {
            Some(image_url) => {
                if let Ok(Some(existing_url)) = Url::find_by_id(url_id).one(&db).await {
                    let mut active = existing_url.into_active_model();
                    active.image_url = Set(Some(image_url));
                    let _ = active.update(&db).await; 
                }
            },
            None => {}
        }

    });

    let response = ApiResponse::success("Url Shortened successfully",shortened_url);
    Ok((StatusCode::OK,Json(response)))
}