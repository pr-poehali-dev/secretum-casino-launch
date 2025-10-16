CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    reward_amount INTEGER NOT NULL,
    max_uses INTEGER NOT NULL,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promo_activations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    promo_code_id INTEGER NOT NULL REFERENCES promo_codes(id),
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, promo_code_id)
);

INSERT INTO promo_codes (code, reward_amount, max_uses) VALUES
('Secretum', 54, 10),
('gurmanov', 54, 5),
('ISMAILOV', 30000, 1),
('Tre', 30, 5);

CREATE INDEX idx_promo_code ON promo_codes(code);
CREATE INDEX idx_promo_user ON promo_activations(user_id);
