import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import centers from "@/data/centers.json";
import practitioners from "@/data/practitioners.json";
import { Icon, map } from "leaflet";
import hospitalPng from "@/assets/img/hospital.png";
import doctorIconPng from "@/assets/img/doctors.png";
import userLocationIconPng from "@/assets/img/pin-map.png";
import PhoneIcon from "@/components/icons/PhoneIcon.png";
import LocationIcon from "@/components/icons/LocationIcon";
import { useRef, useState } from "react";

function Map({ isDoctor }) {
  const itemRefs = useRef({});
  const markerRefs = useRef({});
  const [map, setMap] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const data = isDoctor ? [...centers, ...practitioners] : centers;
  const types = [...new Set(data.map((item) => item.type))];
  const [referencePoint, setReferencePoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = selectedType
    ? data.filter((d) => d.type === selectedType)
    : data;

  const scrollToItem = (id) => {
    const el = itemRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      Object.values(itemRefs.current).forEach((element) => {
        element.classList.remove("highlight");
      });
      el.classList.add("highlight");
    }
  };

  const recenterMap = (item, article) => {
    Object.values(itemRefs.current).forEach((element) => {
      element.classList.remove("highlight");
    });
    article.classList.add("highlight");
    article.scrollIntoView({ behavior: "smooth", block: "start" });
    map.flyTo([item.lat, item.lng], 13, { animate: false });
    const marker = markerRefs.current[item.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const centerIcon = new Icon({
    iconUrl: hospitalPng,
    iconSize: [36, 36],
  });

  const locationIcon = new Icon({
    iconUrl: userLocationIconPng,
    iconSize: [36, 36],
  });

  const doctorIcon = new Icon({
    iconUrl: doctorIconPng,
    iconSize: [36, 36],
  });

  const recenterByPostalCode = async (e) => {
    e.preventDefault();
    if (!postalCode) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=fr&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 11, { duration: 1.2 });
      } else {
        alert("Code postal introuvable");
      }
    } catch (err) {
      console.error("Erreur géocodage:", err);
    }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n’est pas supportée par ce navigateur");
      return;
    }
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setReferencePoint({ lat: latitude, lng: longitude });
        if (map) {
          map.flyTo([latitude, longitude], 12, { duration: 1.5 });
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Erreur géolocalisation:", err);
        alert("Impossible de récupérer votre position");
        setIsLoading(false);
      }
    );
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const sortedData = referencePoint
    ? [...data].sort((a, b) => {
        const distA = getDistance(
          referencePoint.lat,
          referencePoint.lng,
          a.lat,
          a.lng
        );
        const distB = getDistance(
          referencePoint.lat,
          referencePoint.lng,
          b.lat,
          b.lng
        );
        return distA - distB;
      })
    : data;
  return (
    <div className="map-form-container">
      <div className="map-filters">
        <div className="location-filters">
          <form onSubmit={recenterByPostalCode} className="postal-form">
            <input
              type="text"
              placeholder="Entrez un code postal"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <button type="submit">Rechercher</button>
          </form>
          ou
          <button onClick={handleGeolocate} disabled={isLoading}>
            {isLoading ? "⏳ Recherche..." : "📍 Me géolocaliser"}
          </button>
        </div>
        {isDoctor && (
          <div className="category-filters">
            <label htmlFor="type-select">Afficher uniquement :</label>
            <select
              id="type-select"
              value={selectedType || ""}
              onChange={(e) => setSelectedType(e.target.value || null)}
            >
              <option value="">Tous</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="directory-map-container">
        <div className="directory-list">
          {sortedData.map((item) => (
            <article
              key={item.id}
              className="card"
              ref={(el) => (itemRefs.current[item.id] = el)}
              onClick={() => recenterMap(item, itemRefs.current[item.id])}
            >
              <div className="header">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.type}</p>
                </div>
                {referencePoint ? (
                  <p className="distance">
                    {getDistance(
                      referencePoint.lat,
                      referencePoint.lng,
                      item.lat,
                      item.lng
                    ).toFixed(1)}{" "}
                    km
                  </p>
                ) : null}
              </div>
              <hr />
              <p className="address">
                <LocationIcon />
                {item.adress}
              </p>

              <a className="phone" href={`tel:${item.phone}`}>
                <PhoneIcon width={20} height={20} fill="#C9A66B"/>
                {item.phone}
              </a>
            </article>
          ))}
        </div>
        <MapContainer center={[46.580002, 0.34]} zoom={13} ref={setMap}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredData.map((item) => (
            <Marker
              icon={item.type === "Centre d'imagerie" ? centerIcon : doctorIcon}
              ref={(el) => (markerRefs.current[item.id] = el)}
              key={item.id}
              position={[item.lat, item.lng]}
              eventHandlers={{
                click: () => scrollToItem(item.id),
              }}
            >
              <Popup>
                <p className="name">{item.name}</p>
                <p>{item.type}</p>
              </Popup>
            </Marker>
          ))}
          {referencePoint ? (
            <Marker
              icon={locationIcon}
              position={[referencePoint.lat, referencePoint.lng]}
            ></Marker>
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;

/* <a href="https://www.flaticon.com/free-icons/hospital" title="hospital icons">Hospital icons created by André Luiz Gollo - Flaticon</a> */

/* <a href="https://www.flaticon.com/free-icons/doctor" title="doctor icons">Doctor icons created by juicy_fish - Flaticon</a> */

/* <a href="https://www.flaticon.com/free-icons/pin-map" title="pin map icons">Pin map icons created by Freepik - Flaticon</a> */
