use axum::extract::FromRequestParts;
use chrono::Utc;
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::env::ENV, utils::error::ApiError};

pub struct Keys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

impl Keys {
    pub fn new(jwt_secret: String) -> Self {
        let secret = jwt_secret.as_bytes();
        Keys {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user_id: Uuid,
    pub exp: usize,
}

#[derive(Serialize)]
pub struct Tokens {
    pub access_token: String,
    pub refresh_token: String,
}

impl Claims {
    pub fn generate_access_token(user_id: Uuid) -> Result<String, ApiError> {
        let exp = (Utc::now() + ENV.access_token_expiry).timestamp() as usize;
        let claims = Claims {
            user_id,
            exp,
        };
        encode(&Header::default(), &claims, &ENV.access_token_keys.encoding).map_err(|_| ApiError::TokenCreation)
    }

    pub fn generate_refresh_token(user_id: Uuid) -> Result<String, ApiError> {
        let exp = (Utc::now() + ENV.refresh_token_expiry).timestamp() as usize;
        let claims = Claims {
            user_id,
            exp,
        };
        encode(&Header::default(), &claims, &ENV.refresh_token_keys.encoding).map_err(|_| ApiError::TokenCreation)
    }

    pub fn generate_token_pair(user_id: Uuid) -> Result<Tokens, ApiError> {
        let access_token = Self::generate_access_token(user_id)?;
        let refresh_token = Self::generate_refresh_token(user_id)?;

        Ok(Tokens { access_token, refresh_token })
    }

    pub fn verify_refresh_token(token: &str) -> Result<Claims, ApiError> {
        decode::<Claims>(token, &ENV.refresh_token_keys.decoding, &Validation::default())
            .map(|data| data.claims)
            .map_err(|_| ApiError::InvalidRefreshToken)
    }
}

impl<S> FromRequestParts<S> for Claims
where
    S: Sync + Send,
{
    type Rejection = ApiError;
    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("authorization")
            .ok_or(ApiError::InvalidToken)?;
        let auth_str = auth_header.to_str().map_err(|_| ApiError::InvalidToken)?;
        let token = auth_str
            .strip_prefix("Bearer ")
            .ok_or(ApiError::InvalidToken)?;

        let token_data = decode::<Claims>(token, &ENV.access_token_keys.decoding, &Validation::default())
            .map_err(|_| ApiError::InvalidToken)?;

        Ok(token_data.claims)
    }
}