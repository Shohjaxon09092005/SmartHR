-- User Profiles Table
-- Stores extended profile information for users
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal Information
    bio TEXT,
    location VARCHAR(255),
    birth_date DATE,
    
    -- Professional Information
    professional_title VARCHAR(255),
    experience_years VARCHAR(50),
    current_company VARCHAR(255),
    
    -- Social Links (stored as JSON for flexibility)
    social_links JSONB DEFAULT '{}',
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Table
CREATE TABLE IF NOT EXISTS user_education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    degree VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience Table
CREATE TABLE IF NOT EXISTS user_experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio Projects Table
CREATE TABLE IF NOT EXISTS user_portfolio (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link VARCHAR(500),
    technologies TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_education_user ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_experience_user ON user_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_user_portfolio_user ON user_portfolio(user_id);

-- Drop triggers if they exist (for re-running migration)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_education_updated_at ON user_education;
DROP TRIGGER IF EXISTS update_user_experience_updated_at ON user_experience;
DROP TRIGGER IF EXISTS update_user_portfolio_updated_at ON user_portfolio;

-- Trigger to update updated_at for user_profiles
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for user_education
CREATE TRIGGER update_user_education_updated_at BEFORE UPDATE ON user_education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for user_experience
CREATE TRIGGER update_user_experience_updated_at BEFORE UPDATE ON user_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for user_portfolio
CREATE TRIGGER update_user_portfolio_updated_at BEFORE UPDATE ON user_portfolio
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

