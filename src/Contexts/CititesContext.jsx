import { createContext, useContext, useState, useEffect } from "react";

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const BASE_URL = "https://fake-server-gamma.vercel.app";

  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const storedData = JSON.parse(localStorage.getItem("cities")) || [];

        if (storedData.length > 0) {
          setCities(storedData);
        } else {
          const res = await fetch(`${BASE_URL}/cities`);
          const data = await res.json();

          setCities(data);
          localStorage.setItem("cities", JSON.stringify(data));
        }
      } catch {
        alert("There was an error loading data...");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getCity = async (id) => {
    try {
      setIsLoading(true);

      const storedData = JSON.parse(localStorage.getItem("cities")) || [];
      const city = storedData.find((c) => String(c.id) === String(id));
      if (!city) {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        setCurrentCity(data);
      }
      setCurrentCity(city);
    } catch {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  };

  const createCity = async (newCity) => {
    try {
      setIsLoading(true);

      localStorage.setItem("cities", JSON.stringify([...cities, newCity]));

      // const res = await fetch(`${BASE_URL}/cities`, {
      //   method: "POST",
      //   body: JSON.stringify(newCity),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data = await res.json();
      setCities((cities) => [...cities, newCity]);
    } catch {
      alert("There was an error creating city.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCity = async (id) => {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      localStorage.removeItem("cities");
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deleting city.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitesProvider!");
  return context;
};

export { CitiesProvider, useCities };
