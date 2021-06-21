export const login = async ({ email, password }) => {
  const res = await fetch(`${process.env.REACT_APP_AUTH_API}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password, app: 'smartrs' }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const signup = async ({ email }) => {
  const res = await fetch(`${process.env.REACT_APP_AUTH_API}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identity: email, app: 'smartrs' }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const verification = async ({ email, otp }) => {
  const data = {
    identity: email,
    verification_pin: otp,
    app: 'smartrs',
  };

  const res = await fetch(`${process.env.REACT_APP_AUTH_API}/register/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const resendOTP = async ({ email }) => {
  const data = {
    identity: email,
    app: 'smartrs',
  };

  const res = await fetch(`${process.env.REACT_APP_AUTH_API}/register/resend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const forgotPassword = async ({ email }) => {
  const data = {
    username: email,
    app: 'smartrs',
  };

  const res = await fetch(
    `${process.env.REACT_APP_AUTH_API}/login/forgot-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};

export const resetPassword = async ({ token, password }) => {
  const data = {
    app: 'smartrs',
    token,
    password,
  };

  const res = await fetch(
    `${process.env.REACT_APP_AUTH_API}/login/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return await res.json();
};
