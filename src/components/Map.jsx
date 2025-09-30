import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import centers from "@/data/centers.json";
import practitioners from "@/data/practitioners.json";
import { Icon, map } from "leaflet";
import hospitalPng from "@/assets/img/hospital.png";
import practitionerIcon from "@/assets/img/practitioner.png";
import PhoneIcon from "@/components/icons/PhoneIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import { useRef } from "react";

function Map({ isProfessionnal }) {
  const itemRefs = useRef({});
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

  const mapRef = useRef();

  // fonction utilitaire : recentre la map
  const recenterMap = (lat, lng) => {
    mapRef.current?.setView([lat, lng], 13);
    console.log(mapRef)
  };

  const centerIcon = new Icon({
    iconUrl: hospitalPng,
    iconSize: [32, 32],
  });

  //  const pracitionnerIcon  = new Icon ({
  //   iconUrl: ("/img/practitioner.png"),
  //   iconSize: [32,32]
  // })
  return (
    <div className="directory-map-container">
      <div className="directory-list">
        {[...centers, ...practitioners].map((item) => (
          <article
            key={item.id}
            className="card"
            ref={(el) => (itemRefs.current[item.id] = el)}
            onClick={() => recenterMap(item.lat, item.lng)}
          >
            <div className="header">
              <h3>{item.name}</h3>
              <p>{item.type}</p>
            </div>
            <hr />
            <p className="address">
              <LocationIcon />
              {item.adress}
            </p>

            <a className="phone" href={`tel:${item.phone}`}>
              <PhoneIcon width={20} height={20} />
              {item.phone}
            </a>
          </article>
        ))}
      </div>
      <MapContainer
        center={[46.580002, 0.34]}
        zoom={13}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {[...centers, ...practitioners].map((item) => (
          <Marker
            // icon={item.type === "centre d'imagerie" ? centerIcon : practitionerIcon}
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
      </MapContainer>
    </div>
  );
}

export default Map;
{
  /* <a href="https://www.flaticon.com/fr/icones-gratuites/hopital" title="hôpital icônes">Hôpital icônes créées par Infinite Dendrogram - Flaticon</a> */
}
{
  /* <a href="https://www.flaticon.com/fr/icones-gratuites/medecin" title="médecin icônes">Médecin icônes créées par monkik - Flaticon</a> */
}
