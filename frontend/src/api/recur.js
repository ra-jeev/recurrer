const API_URL = process.env.REACT_APP_API_BASE_URL + '/recurs';
const makeCall = async (method, token, data, endpoint) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return await fetch(`${API_URL}${endpoint || ''}`, options);
};

const getRecurs = async (token) => {
  const res = await makeCall('GET', token);
  if (res.ok) {
    const data = await res.json();
    console.log('server returned recurs:', data);

    return data;
  }
};

const createRecur = async (data, token) => {
  console.log(`createRecur called with data: ${JSON.stringify(data, null, 2)}`);

  const res = await makeCall('POST', token, data);
  if (res.ok) {
    const data = await res.json();
    console.log('recur created:', data);

    return data;
  }
};

const updateRecur = async (id, data, token) => {
  console.log(`updateRecur called with data: ${JSON.stringify(data, null, 2)}`);

  const res = await makeCall('PUT', token, data, `/${id}`);
  if (res.ok) {
    const data = await res.json();
    console.log('recur updated:', data);

    return data;
  }
};

export { getRecurs, createRecur, updateRecur };
