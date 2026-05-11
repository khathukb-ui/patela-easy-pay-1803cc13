def test_register_and_login(client):
    # Register
    resp = client.post("/api/auth/register", json={
        "full_name": "Test User",
        "email": "test@example.com",
        "password": "SecureP@ss123",
    })
    assert resp.status_code == 201
    tokens = resp.json()
    assert "access_token" in tokens

    # Login
    resp = client.post("/api/auth/login", json={
        "identifier": "test@example.com",
        "password": "SecureP@ss123",
    })
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password(client):
    client.post("/api/auth/register", json={
        "full_name": "Test",
        "email": "test2@example.com",
        "password": "SecureP@ss123",
    })
    resp = client.post("/api/auth/login", json={
        "identifier": "test2@example.com",
        "password": "wrong",
    })
    assert resp.status_code == 401


def test_otp_disabled(client):
    resp = client.post("/api/auth/otp/request")
    assert resp.status_code == 501
