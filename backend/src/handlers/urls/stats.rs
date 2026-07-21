use axum::{extract::State, Json, http::StatusCode};
use sea_orm::{ColumnTrait, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect};
use serde::Serialize;

use crate::{entities::{prelude::*, url::{self, Model}},state::AppState,utils::{auth::Claims, error::ApiError, response::ApiResponse, ApiResult}};

#[derive(Serialize)]
pub struct DashboardStats {
    pub total_links: u64,
    pub total_clicks: i64,
    pub top_links: Vec<Model>,
    pub recent_links: Vec<Model>,
}

pub async fn get_dashboard_stats(claims: Claims, State(state): State<AppState>) -> ApiResult<DashboardStats> {
    let user_id = claims.user_id;

    let total_links = Url::find()
        .filter(url::Column::UserId.eq(user_id))
        .filter(url::Column::Archived.eq(false))
        .count(&state.db)
        .await
        .map_err(|_| ApiError::Internal)?;

    let all_links = Url::find()
        .filter(url::Column::UserId.eq(user_id))
        .all(&state.db)
        .await
        .map_err(|_| ApiError::Internal)?;

    let total_clicks: i64 = all_links.iter().map(|u| u.click_count as i64).sum();

    let top_links = Url::find()
        .filter(url::Column::UserId.eq(user_id))
        .filter(url::Column::Archived.eq(false))
        .order_by_desc(url::Column::ClickCount)
        .limit(4)
        .all(&state.db)
        .await
        .map_err(|_| ApiError::Internal)?;

    let recent_links = Url::find()
        .filter(url::Column::UserId.eq(user_id))
        .filter(url::Column::Archived.eq(false))
        .order_by_desc(url::Column::CreatedAt)
        .limit(5)
        .all(&state.db)
        .await
        .map_err(|_| ApiError::Internal)?;

    let stats = DashboardStats {
        total_links,
        total_clicks,
        top_links,
        recent_links,
    };

    let response = ApiResponse::success("Dashboard stats fetched successfully", stats);
    Ok((StatusCode::OK, Json(response)))
}
