import { createRef } from 'react';

export const navigate = (routeName, params) => {
  navigationRef.current?.navigate(routeName, params);
};

export const reset = (routeName, params) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ 
      name: routeName,
      params: params ? params : {}
    }],
  });
};


export const navigationRef = createRef();
