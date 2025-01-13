export const getBaseUrl = () => {
    return import.meta.env.NODE_ENV === "development"
      ? import.meta.env.VITE_DOMAIN
      : import.meta.env.VITE_DOMAIN_HOST;
  };

  
  