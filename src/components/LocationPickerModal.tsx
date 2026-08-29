import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  MapPin, 
  Crosshair, 
  Check, 
  Home, 
  Building2, 
  PartyPopper,
  ShieldCheck
} from 'lucide-react';
import { Address } from '../types';
import L from 'leaflet';

export const LocationPickerModal: React.FC = () => {
  const { locationModalOpen, setLocationModalOpen, locationCallback, showToast } = useStore();
  const { user, addSavedAddress } = useAuth();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.8978, // Sylhet Mirboxtula
    lng: 91.8714
  });

  const [tag, setTag] = useState<'Home' | 'Office' | 'Event Venue' | 'Other'>('Home');
  const [recipientName, setRecipientName] = useState<string>(user?.displayName || 'Ahmed Hussain');
  const [phone, setPhone] = useState<string>(user?.phone || '+880 1711-102448');
  const [addressLine, setAddressLine] = useState<string>('মিরবক্সটুলা মেইন রোড');
  const [floorUnit, setFloorUnit] = useState<string>('৩য় তলা, ফ্ল্যাট ৩বি');
  const [area, setArea] = useState<string>('Mirboxtula');
  const [city, setCity] = useState<string>('Sylhet');
  const [postalCode, setPostalCode] = useState<string>('3100');
  const [instructions, setInstructions] = useState<string>('দরজার সামনে ২টি খালি জার রাখা আছে, নিয়ে নতুন জার দিন।');

  // Initialize Leaflet Map when modal opens
  useEffect(() => {
    if (!locationModalOpen) return;

    const timer = setTimeout(() => {
      if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([coords.lat, coords.lng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const customIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        });

        const marker = L.marker([coords.lat, coords.lng], {
          draggable: true,
          icon: customIcon
        }).addTo(map);

        marker.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          setCoords({ lat: newPos.lat, lng: newPos.lng });
        });

        map.on('click', (e) => {
          marker.setLatLng(e.latlng);
          setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [locationModalOpen]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });

          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([lat, lng], 16);
            markerRef.current.setLatLng([lat, lng]);
          }
          showToast('success', 'Location Detected', 'Pin updated to your current GPS position.');
        },
        (error) => {
          showToast('warning', 'Location Access Denied', 'Please drag the pin manually on the map.');
        }
      );
    }
  };

  const handleSaveAddress = async () => {
    const newAddress: Address = {
      id: 'addr-' + Date.now(),
      tag,
      recipientName,
      phone,
      addressLine,
      floorUnit,
      area,
      city,
      postalCode,
      lat: coords.lat,
      lng: coords.lng,
      instructions
    };

    await addSavedAddress(newAddress);

    if (locationCallback) {
      locationCallback(newAddress);
    }

    showToast('success', 'Address Saved', `${tag} address pinned successfully.`);
    setLocationModalOpen(false);
  };

  if (!locationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pin Delivery Location</h3>
              <p className="text-xs text-slate-500">Accurate delivery pinning ensures our trucks arrive on time.</p>
            </div>
          </div>
          <button
            onClick={() => setLocationModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaflet Map Stage */}
        <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full" />
          
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="absolute top-3 right-3 z-[400] bg-white/95 hover:bg-white text-cyan-800 px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-600" />
            <span>Use My GPS</span>
          </button>
        </div>

        {/* Address Fields Form */}
        <div className="space-y-4">
          
          {/* Tag Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Save Location As</label>
            <div className="grid grid-cols-4 gap-2">
              {(['Home', 'Office', 'Event Venue', 'Other'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    tag === t ? 'bg-cyan-600 text-white border-cyan-600' : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Street / House / Road</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Floor / Flat / Unit</label>
              <input
                type="text"
                value={floorUnit}
                onChange={(e) => setFloorUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Area / Zone</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Mirboxtula">মিরবক্সটুলা (Mirboxtula)</option>
                <option value="Zindabazar">জিন্দাবাজার (Zindabazar)</option>
                <option value="Amberkhana">আম্বরখানা (Amberkhana)</option>
                <option value="Chowhatta">চৌহাট্টা (Chowhatta)</option>
                <option value="Shibgonj">শিবগঞ্জ (Shibgonj)</option>
                <option value="Upashahar">উপশহর (Upashahar)</option>
                <option value="Kumarpara">কুমারপাড়া (Kumarpara)</option>
                <option value="Subidbazar">সুবিদবাজার (Subidbazar)</option>
                <option value="Tilagarh">টিলাগড় (Tilagarh)</option>
                <option value="South Surma">দক্ষিণ সুরমা (South Surma)</option>
                <option value="Dhaka Banani">বনানী (Dhaka Banani)</option>
                <option value="Dhaka Gulshan">গুলশান (Dhaka Gulshan)</option>
                <option value="Dhaka Dhanmondi">ধানমন্ডি (Dhaka Dhanmondi)</option>
                <option value="Dhaka Uttara">উত্তরা (Dhaka Uttara)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Driver Delivery Instructions / Empty Jar Notes</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Ring bell 5B. Leave empty jars at the door."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setLocationModalOpen(false)}
            className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAddress}
            className="flex-1 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Save Pin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
