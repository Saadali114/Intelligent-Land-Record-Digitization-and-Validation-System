'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Maximize2,
  Layers,
  MapPin,
  FileText,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Landmark,
  AlertTriangle,
  Building2,
  Copy,
  Check,
  ChevronRight,
  Compass,
  Calendar,
  Play,
  Pause,
  Columns,
  History,
  TrendingDown,
  Clock,
  Eye,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export type TimelineYear = 2001 | 2010 | 2018 | 2026;

export interface CadastralParcel {
  id: string;
  owner: string;
  area: string;
  type: 'agri' | 'resi' | 'fallow';
  crop: string;
  village: string;
  taluka: string;
  district: string;
  ulpin: string;
  khataNumber?: string;
  khasraNumber?: string;
  valuation?: string;
  encumbrance?: string;
  hasActiveDispute?: boolean;
  historical2001: {
    landUse: string;
    crop: string;
    builtUpPercent: string;
    ndvi: string;
    ownerIn2001: string;
    satelliteSensor: string;
    acquisitionDate: string;
    boundaryIntegrity: string;
  };
  coords: [number, number][];
  mutations: [string, string, string][]; // [Date, MutationNo, Description]
}

// Satellite Timeline Metadata
const TIMELINE_METADATA: Record<
  TimelineYear,
  {
    label: string;
    satelliteSensor: string;
    date: string;
    resolution: string;
    filterClass: string;
    description: string;
  }
> = {
  2001: {
    label: '2001 Historical',
    satelliteSensor: 'ISRO IRS-1D LISS-III / Landsat-7 ETM+',
    date: '04-Nov-2001 (Post-Monsoon)',
    resolution: '23.5m Multi-Spectral Band',
    filterClass: 'contrast-[1.25] saturate-[1.45] hue-rotate-[-10deg] brightness-[0.95]',
    description: 'Historical agricultural canopy & unpaved rural cart tracks. Zero NA plotted sprawl.',
  },
  2010: {
    label: '2010 Intermediate',
    satelliteSensor: 'Cartosat-1 / QuickBird Stereo',
    date: '18-Feb-2010 (Winter Survey)',
    resolution: '2.5m High-Resolution',
    filterClass: 'contrast-[1.12] saturate-[1.15] brightness-[0.98]',
    description: 'Initial rural-urban transition fringe. Family parcel partition demarcation begins.',
  },
  2018: {
    label: '2018 Pre-DILRMP',
    satelliteSensor: 'Sentinel-2A / Cartosat-2B',
    date: '22-Dec-2018 (Cadastral Mesh)',
    resolution: '1.0m Multi-Spectral',
    filterClass: 'contrast-[1.05] saturate-[1.05]',
    description: 'DILRMP 2.0 digital verification phase. Paved arterial access roads established.',
  },
  2026: {
    label: '2026 Present',
    satelliteSensor: 'Maxar WorldView-3 / Drone Ortho HD',
    date: '14-Jan-2026 (Live Bhuvan)',
    resolution: '0.3m Ultra-HD Orthorectified',
    filterClass: 'contrast-100 saturate-100',
    description: 'State-of-the-art DILRMP 3.0 Bhu-Aadhaar ULPIN registered cadastral parcel boundary.',
  },
};

// Cadastral parcel dataset aligned with official ILRDVS live records & coordinates
const DEFAULT_PARCELS: CadastralParcel[] = [
  {
    id: '145/2A',
    owner: 'Ganesh Ramchandra Kulkarni & Co-sharers',
    area: '0.85 Ha (8,500 sq.m)',
    type: 'agri',
    crop: 'Sugarcane & Wheat (Kharif/Rabi)',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    ulpin: '81LVQLD9407JH0',
    khataNumber: 'KH-8821',
    khasraNumber: '145/2A',
    valuation: '₹ 42.50 Lakh',
    encumbrance: 'No Dues / Clear Title (Unencumbered)',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Pure Agricultural Farmland (Jirayat Class 1)',
      crop: 'Sugarcane & Rainfed Jowar (NDVI: 0.74)',
      builtUpPercent: '0% (Rural open canopy)',
      ndvi: '0.74 (Dense Cultivation)',
      ownerIn2001: 'Ramchandra Mahadev Kulkarni (Father)',
      satelliteSensor: 'ISRO IRS-1D LISS-III (Band 2,3,4 False Color)',
      acquisitionDate: '04-Nov-2001',
      boundaryIntegrity: '100% match with 1972 Consolidation Survey pegs',
    },
    coords: [
      [18.5219, 73.8555],
      [18.5219, 73.8567],
      [18.5213, 73.8567],
      [18.5213, 73.8555],
    ],
    mutations: [
      ['14 Feb 2025', 'Mutation #4821', 'Inheritance & Succession sanctioned by Circle Revenue Officer'],
      ['19 Oct 2017', 'Mutation #3914', 'Family Partition Deed registered at Sub-Registrar Haveli'],
      ['03 May 2004', 'Mutation #2102', 'First Revenue Settlement Entry under MLR Code 1966'],
    ],
  },
  {
    id: '88/3',
    owner: 'Kisan Trimbak Patil & Legal Heirs',
    area: '1.42 Ha (14,200 sq.m)',
    type: 'agri',
    crop: 'Grapes & Onion (Export Quality)',
    village: 'Vani',
    taluka: 'Dindori',
    district: 'Nashik',
    ulpin: '81LVQLD9407JH1',
    khataNumber: 'KH-4419',
    khasraNumber: '88/3',
    valuation: '₹ 56.80 Lakh',
    encumbrance: 'Bank of Maharashtra Crop Lien (₹ 3,50,000)',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Traditional Dryland Agriculture (Bagayat)',
      crop: 'Millets & Groundnut Farmland',
      builtUpPercent: '0% (Open farmland)',
      ndvi: '0.68 (Healthy Vegetation)',
      ownerIn2001: 'Trimbak Kisan Patil',
      satelliteSensor: 'Landsat-7 ETM+ Orthorectified',
      acquisitionDate: '12-Oct-2001',
      boundaryIntegrity: 'Zero encroachment on natural drainage nala',
    },
    coords: [
      [18.5231, 73.8567],
      [18.5231, 73.8579],
      [18.5225, 73.8579],
      [18.5225, 73.8567],
    ],
    mutations: [
      ['11 Jan 2024', 'Mutation #5102', 'Kisan Credit Card hypothecation charge registered via RBI ULI'],
      ['08 Jul 2019', 'Mutation #4290', 'Succession certificate issued following demise of Trimbak Patil'],
    ],
  },
  {
    id: '211/4',
    owner: 'Pravin Vasantrao Deshmukh',
    area: '0.65 Ha (6,500 sq.m)',
    type: 'resi',
    crop: 'Residential Zone R-1 (PMRDA Sanctioned)',
    village: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    ulpin: '81LVQLD9407JH2',
    khataNumber: 'KH-9014',
    khasraNumber: '211/4',
    valuation: '₹ 1.85 Crore',
    encumbrance: 'Clear Title / Zero Liens',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Agricultural Mango Orchard & Crop Field',
      crop: 'Horticulture (Mango Plantation)',
      builtUpPercent: '0% (Rural Orchard)',
      ndvi: '0.81 (High Canopy)',
      ownerIn2001: 'Vasantrao Deshmukh',
      satelliteSensor: 'ISRO IRS-1D LISS-III',
      acquisitionDate: '28-Nov-2001',
      boundaryIntegrity: 'Converted to NA in 2023 with verified revenue demarcation',
    },
    coords: [
      [18.5225, 73.8579],
      [18.5225, 73.8591],
      [18.5219, 73.8591],
      [18.5219, 73.8579],
    ],
    mutations: [
      ['18 Mar 2023', 'Mutation #6340', 'Non-Agricultural (NA) conversion order by SDO Haveli'],
      ['14 Dec 2015', 'Mutation #3108', 'Registered Sale Deed from Vasantrao Deshmukh'],
    ],
  },
  {
    id: '142/1',
    owner: 'Ramesh Dattatray Patil',
    area: '1.24 Ha (12,400 sq.m)',
    type: 'agri',
    crop: 'Sugarcane (Kharif)',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    ulpin: '81LVQLD9407JH3',
    khataNumber: 'KH-3312',
    khasraNumber: '142/1',
    valuation: '₹ 62.00 Lakh',
    encumbrance: 'No Encumbrances Recorded',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Agricultural Paddy & Sugarcane',
      crop: 'Sugarcane Cultivation',
      builtUpPercent: '0%',
      ndvi: '0.72',
      ownerIn2001: 'Dattatray Patil',
      satelliteSensor: 'IRS-1D Multi-Spectral',
      acquisitionDate: '04-Nov-2001',
      boundaryIntegrity: 'Boundary stones verified intact',
    },
    coords: [
      [18.5231, 73.8579],
      [18.5231, 73.8591],
      [18.5225, 73.8591],
      [18.5225, 73.8579],
    ],
    mutations: [
      ['12 Jun 2021', 'Mutation #4109', 'Inheritance transferred from Dattatray Patil'],
      ['03 Feb 2016', 'Mutation #2981', 'Boundary resurvey recorded by Circle Inspector'],
    ],
  },
  {
    id: '143/0',
    owner: 'Government of Maharashtra / Gram Panchayat',
    area: '0.32 Ha (3,200 sq.m)',
    type: 'fallow',
    crop: 'Public Utility / Water Percolation Pond',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    ulpin: '81LVQLD9407JH4',
    khataNumber: 'KH-0001',
    khasraNumber: '143/0',
    valuation: 'State Public Asset',
    encumbrance: 'Government Inalienable Land',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Traditional Village Grazing Land (Gairan)',
      crop: 'Natural Grassland & Rainwater Pond',
      builtUpPercent: '0%',
      ndvi: '0.52',
      ownerIn2001: 'State Revenue Department',
      satelliteSensor: 'Landsat-7 ETM+',
      acquisitionDate: '15-Oct-2001',
      boundaryIntegrity: 'Protected Village Common Asset (Sec 22 MLR Code)',
    },
    coords: [
      [18.5225, 73.8567],
      [18.5225, 73.8579],
      [18.5219, 73.8579],
      [18.5219, 73.8567],
    ],
    mutations: [
      ['—', 'Entry #01', 'Dedicated Gram Panchayat Gairan / Community Land'],
    ],
  },
  {
    id: '144/2',
    owner: 'Meera Anil More',
    area: '0.49 Ha (4,900 sq.m)',
    type: 'resi',
    crop: 'Residential Plotting',
    village: 'Khadakwasla',
    taluka: 'Haveli',
    district: 'Pune',
    ulpin: '81LVQLD9407JH5',
    khataNumber: 'KH-7718',
    khasraNumber: '144/2',
    valuation: '₹ 88.20 Lakh',
    encumbrance: 'Clear Title',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Agricultural Field (Undivided family holding)',
      crop: 'Seasonal Vegetables & Fodder',
      builtUpPercent: '0%',
      ndvi: '0.70',
      ownerIn2001: 'Anil S. More & Joint Family',
      satelliteSensor: 'IRS-1D LISS-III',
      acquisitionDate: '04-Nov-2001',
      boundaryIntegrity: 'Partitioned in 2022',
    },
    coords: [
      [18.5219, 73.8579],
      [18.5219, 73.8591],
      [18.5213, 73.8591],
      [18.5213, 73.8579],
    ],
    mutations: [
      ['27 Nov 2022', 'Mutation #5890', 'Land use converted to Residential Class 1'],
    ],
  },
  {
    id: '42/1B',
    owner: 'Devendra Bapurao Deshmukh',
    area: '3.40 Ha (34,000 sq.m)',
    type: 'agri',
    crop: 'Cotton & Soybean (Kharif Cash Crops)',
    village: 'Hingna',
    taluka: 'Hingna',
    district: 'Nagpur',
    ulpin: '81LVQLD9410JH3',
    khataNumber: 'KT-774',
    khasraNumber: '42/1B',
    valuation: '₹ 1.05 Crore',
    encumbrance: 'Clear Title (Zero Encumbrances)',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Traditional Vidarbha Black Soil Farmland',
      crop: 'Cotton & Pulses Canopy',
      builtUpPercent: '0%',
      ndvi: '0.65',
      ownerIn2001: 'Bapurao Deshmukh (Father)',
      satelliteSensor: 'IRS-1D LISS-III',
      acquisitionDate: '18-Nov-2001',
      boundaryIntegrity: 'Pillars certified under DILRMP GIS',
    },
    coords: [
      [18.5207, 73.8555],
      [18.5207, 73.8567],
      [18.5201, 73.8567],
      [18.5201, 73.8555],
    ],
    mutations: [
      ['09 Jan 2024', 'Mutation #3012', 'Succession partitioned and sanctioned by Tehsildar'],
    ],
  },
  {
    id: '102/5',
    owner: 'Aniket Manohar Sawant',
    area: '0.95 Ha (9,500 sq.m)',
    type: 'resi',
    crop: 'Commercial Complex & Warehousing Zone',
    village: 'Karjat',
    taluka: 'Karjat',
    district: 'Raigad',
    ulpin: '81LVQLD9411JH4',
    khataNumber: 'KT-218',
    khasraNumber: '102/5',
    valuation: '₹ 77.90 Lakh',
    encumbrance: 'Bank of Baroda Commercial Term Lien (₹ 12,00,000)',
    hasActiveDispute: false,
    historical2001: {
      landUse: 'Horticultural Orchard & Open Grassland',
      crop: 'Cashew & Mango Plantation',
      builtUpPercent: '0%',
      ndvi: '0.78',
      ownerIn2001: 'Manohar Sawant',
      satelliteSensor: 'Landsat-7 ETM+',
      acquisitionDate: '10-Oct-2001',
      boundaryIntegrity: 'Converted to Commercial NA in 2025',
    },
    coords: [
      [18.5207, 73.8567],
      [18.5207, 73.8579],
      [18.5201, 73.8579],
      [18.5201, 73.8567],
    ],
    mutations: [
      ['20 Jan 2025', 'Mutation #1140', 'Commercial Non-Agricultural Order sanctioned by SDO'],
    ],
  },
];

const TYPE_COLORS = {
  agri: {
    fill: '#15803d',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    name: 'Agricultural (कृषी जमीन)',
  },
  resi: {
    fill: '#d97706',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    name: 'Residential NA (रहिवासी)',
  },
  fallow: {
    fill: '#475569',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    name: 'Forest / Public Utility (पडीक / वनजमीन)',
  },
};

interface CadastralGisViewerProps {
  isFullPage?: boolean;
  initialSurvey?: string;
  onParcelSelect?: (parcel: CadastralParcel) => void;
}

export const CadastralGisViewer: React.FC<CadastralGisViewerProps> = ({
  isFullPage = false,
  initialSurvey = '',
  onParcelSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const layersRef = useRef<{
    streetLayer?: any;
    satelliteLayer?: any;
    cadastralGroup?: any;
    labelGroup?: any;
    parcelLayers: Record<string, { poly: any; label: any; center: any }>;
  }>({ parcelLayers: {} });

  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel | null>(null);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(initialSurvey || '');
  const [baseMap, setBaseMap] = useState<'street' | 'satellite'>('satellite');
  const [showCadastral, setShowCadastral] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [copiedULPIN, setCopiedULPIN] = useState<boolean>(false);

  // Historical Timeline States
  const [selectedYear, setSelectedYear] = useState<TimelineYear>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered at Khadakwasla / Pune cadastral cluster
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([18.5220, 73.8572], 16);

      mapInstanceRef.current = map;

      // Base Street layer: OpenStreetMap
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors • ILRDVS DILRMP 3.0 GIS',
        maxZoom: 19,
      });

      // Base Satellite layer: Esri World Imagery (with dynamic historical timeline filter)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics • Govt of Maharashtra',
          maxZoom: 19,
          className: 'satellite-tiles-layer transition-all duration-700',
        }
      ).addTo(map); // default satellite active

      const cadastralGroup = L.layerGroup().addTo(map);
      const labelGroup = L.layerGroup().addTo(map);
      const parcelLayers: Record<string, any> = {};

      // Render Cadastral Parcels
      DEFAULT_PARCELS.forEach((p) => {
        const polyColor = TYPE_COLORS[p.type].fill;

        const poly = L.polygon(p.coords, {
          color: '#1e3a8a',
          weight: 2,
          fillColor: polyColor,
          fillOpacity: 0.35,
        }).addTo(cadastralGroup);

        poly.on('click', () => {
          handleSelectParcel(p.id);
        });

        poly.on('mouseover', function () {
          poly.setStyle({ fillOpacity: 0.65, weight: 3, color: '#f59e0b' });
        });

        poly.on('mouseout', function () {
          poly.setStyle({ fillOpacity: 0.35, weight: 2, color: '#1e3a8a' });
        });

        const center = poly.getBounds().getCenter();
        const label = L.marker(center, {
          icon: L.divIcon({
            className: 'custom-cadastral-label',
            html: `<div style="font-family:'Inter',sans-serif;font-size:10.5px;font-weight:800;color:#0f172a;background:rgba(255,255,255,0.95);border:1.5px solid #1e3a8a;padding:1px 6px;border-radius:4px;box-shadow:0 2px 4px rgba(0,0,0,0.18);white-space:nowrap;transform:translate(-50%,-50%);cursor:pointer;">${p.id}</div>`,
            iconSize: [0, 0],
          }),
        }).addTo(labelGroup);

        parcelLayers[p.id] = { poly, label, center };
      });

      layersRef.current = {
        streetLayer,
        satelliteLayer,
        cadastralGroup,
        labelGroup,
        parcelLayers,
      };

      const toSelect = initialSurvey && parcelLayers[initialSurvey] ? initialSurvey : '145/2A';
      handleSelectParcel(toSelect);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Satellite Layer styling when timeline year changes
  useEffect(() => {
    const tileContainer = document.querySelector('.satellite-tiles-layer') as HTMLElement | null;
    if (!tileContainer) return;

    if (selectedYear === 2001) {
      // 2001 Vintage Satellite Shader: High vegetation contrast, multi-spectral green tint, atmospheric hue
      tileContainer.style.filter = 'contrast(1.3) saturate(1.5) hue-rotate(-12deg) brightness(0.92)';
    } else if (selectedYear === 2010) {
      tileContainer.style.filter = 'contrast(1.18) saturate(1.2) hue-rotate(-4deg) brightness(0.96)';
    } else if (selectedYear === 2018) {
      tileContainer.style.filter = 'contrast(1.08) saturate(1.08) brightness(0.99)';
    } else {
      tileContainer.style.filter = 'none';
    }
  }, [selectedYear]);

  // Timelapse auto-play effect
  useEffect(() => {
    if (!isPlayingTimeline) return;
    const years: TimelineYear[] = [2001, 2010, 2018, 2026];
    const timer = setInterval(() => {
      setSelectedYear((prev) => {
        const nextIdx = (years.indexOf(prev) + 1) % years.length;
        return years[nextIdx];
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [isPlayingTimeline]);

  // Handle Parcel Selection
  const handleSelectParcel = (id: string) => {
    const p = DEFAULT_PARCELS.find((x) => x.id === id);
    if (!p) return;

    setSelectedParcel(p);
    setPanelOpen(true);
    if (onParcelSelect) onParcelSelect(p);

    const layerInfo = layersRef.current.parcelLayers[id];
    if (layerInfo && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(layerInfo.center, 17, { duration: 0.5 });
      layerInfo.poly.setStyle({ fillOpacity: 0.7, weight: 3.5, color: '#f59e0b' });
      setTimeout(() => {
        layerInfo.poly.setStyle({ fillOpacity: 0.35, weight: 2, color: '#1e3a8a' });
      }, 1800);
    }
  };

  // Synchronize selection when initialSurvey prop changes
  useEffect(() => {
    if (!initialSurvey || !layersRef.current?.parcelLayers) return;
    const clean = initialSurvey.trim().toLowerCase();
    const match = Object.keys(layersRef.current.parcelLayers).find(
      (id) => id.toLowerCase() === clean
    );
    if (match) {
      handleSelectParcel(match);
    }
  }, [initialSurvey]);

  // Switch Base Map
  const handleSetBase = (which: 'street' | 'satellite') => {
    setBaseMap(which);
    const map = mapInstanceRef.current;
    const { streetLayer, satelliteLayer } = layersRef.current;
    if (!map || !streetLayer || !satelliteLayer) return;

    if (which === 'street') {
      if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
      if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
    } else {
      if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
      if (!map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);
    }
  };

  // Toggle Overlays
  const handleToggleLayer = (name: 'cadastral' | 'labels', checked: boolean) => {
    const map = mapInstanceRef.current;
    const { cadastralGroup, labelGroup } = layersRef.current;
    if (!map || !cadastralGroup || !labelGroup) return;

    if (name === 'cadastral') {
      setShowCadastral(checked);
      if (checked) {
        if (!map.hasLayer(cadastralGroup)) cadastralGroup.addTo(map);
      } else {
        if (map.hasLayer(cadastralGroup)) map.removeLayer(cadastralGroup);
      }
    } else {
      setShowLabels(checked);
      if (checked) {
        if (!map.hasLayer(labelGroup)) labelGroup.addTo(map);
      } else {
        if (map.hasLayer(labelGroup)) map.removeLayer(labelGroup);
      }
    }
  };

  // Search Parcel
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    const matched = DEFAULT_PARCELS.find(
      (p) => p.id.toLowerCase() === q.toLowerCase() || p.id.includes(q)
    );

    if (matched) {
      handleSelectParcel(matched.id);
    } else {
      alert(
        `No cadastral record found for survey "${q}".\n\nTry clicking one of the live samples: 145/2A, 88/3, 211/4, 142/1`
      );
    }
  };

  const handleCopyULPIN = (ulpin?: string) => {
    if (!ulpin) return;
    navigator.clipboard.writeText(ulpin);
    setCopiedULPIN(true);
    setTimeout(() => setCopiedULPIN(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className={`relative flex flex-col font-sans select-none overflow-hidden bg-slate-100 ${
        isFullPage
          ? 'h-[calc(100vh-108px)] w-full'
          : 'h-[660px] w-full rounded-2xl border border-slate-300 shadow-xl overflow-hidden'
      }`}
    >
      {/* Subheader bar when embedded inside /check-ownership */}
      {!isFullPage && (
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-900 border border-blue-700 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white">
                ILRDVS भू-नकाशा • Live &amp; 2001 Historical Cadastral GIS
              </span>
              <span className="text-[10px] text-slate-400 ml-2 hidden sm:inline">
                DILRMP 3.0 Standard • 2001 IRS-1D Satellite Ground Truth
              </span>
            </div>
          </div>
          <Link
            href="/gis-map"
            target="_blank"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Full-Screen GIS Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Layout Row: Left Control Rail + Map Canvas + Right 7/12 Extract Panel */}
      <div className="flex-1 flex min-h-0 relative">
        {/* LEFT CONTROL RAIL */}
        <aside className="w-64 sm:w-72 bg-white border-r border-slate-200 p-4 overflow-y-auto shrink-0 z-10 flex flex-col justify-between shadow-xs">
          <div className="space-y-5">
            {/* Search Parcel Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Search className="w-3 h-3 text-blue-900" />
                  Search Cadastral Parcel
                </h2>
                <span className="text-[10px] text-blue-900 font-bold font-mono">
                  {DEFAULT_PARCELS.length} Parcels
                </span>
              </div>

              <form onSubmit={handleSearch} className="flex border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-2xs focus-within:ring-2 focus-within:ring-blue-900 focus-within:bg-white transition-all">
                <input
                  type="text"
                  placeholder="e.g. 145/2A, 88/3, 211/4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 text-xs flex-1 text-slate-900 font-semibold outline-none bg-transparent placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="bg-blue-950 hover:bg-blue-900 text-amber-400 px-3.5 text-xs font-bold transition-colors flex items-center justify-center"
                >
                  Go
                </button>
              </form>

              {/* Sample Quick Chips */}
              <div className="flex flex-wrap gap-1 mt-2">
                {['145/2A', '88/3', '211/4', '142/1', '144/2'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSearchQuery(chip);
                      handleSelectParcel(chip);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border ${
                      selectedParcel?.id === chip
                        ? 'bg-blue-950 text-amber-300 border-blue-950 shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Base Map Selector (Street vs Satellite) */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2 flex items-center gap-1">
                <Layers className="w-3 h-3 text-blue-900" />
                Base Map Layer
              </h2>
              <div className="space-y-1.5">
                <label
                  onClick={() => handleSetBase('satellite')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer text-xs transition-all ${
                    baseMap === 'satellite'
                      ? 'border-blue-900 bg-blue-50/70 font-bold text-blue-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="baseMapTheme"
                    checked={baseMap === 'satellite'}
                    onChange={() => handleSetBase('satellite')}
                    className="accent-blue-900"
                  />
                  <span>Satellite Imagery (Timeline Active)</span>
                </label>

                <label
                  onClick={() => handleSetBase('street')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer text-xs transition-all ${
                    baseMap === 'street'
                      ? 'border-blue-900 bg-blue-50/70 font-bold text-blue-950 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="baseMapTheme"
                    checked={baseMap === 'street'}
                    onChange={() => handleSetBase('street')}
                    className="accent-blue-900"
                  />
                  <span>Street / GIS Reference (OSM)</span>
                </label>
              </div>
            </div>

            {/* Historical Satellite Timeline Selector Card */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-2.5 shadow-sm border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] uppercase font-bold text-amber-400 flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  Historical Imagery
                </span>
                <span className="text-[10px] font-mono bg-blue-900/80 px-1.5 py-0.5 rounded text-cyan-300 font-bold">
                  {selectedYear}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {([2001, 2010, 2018, 2026] as TimelineYear[]).map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-black transition-all ${
                      selectedYear === yr
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              <div className="text-[10px] text-slate-300 leading-tight border-t border-slate-800 pt-2 space-y-0.5">
                <div className="font-bold text-amber-300 truncate">
                  {TIMELINE_METADATA[selectedYear].satelliteSensor}
                </div>
                <div className="text-slate-400 font-mono text-[9.5px]">
                  Date: {TIMELINE_METADATA[selectedYear].date}
                </div>
              </div>
            </div>

            {/* Cadastral Overlays */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                Cadastral Overlays
              </h2>
              <div className="space-y-2 text-xs divide-y divide-slate-100 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-700 font-medium">Boundary Polygons (हद्द रेषा)</span>
                  <input
                    type="checkbox"
                    checked={showCadastral}
                    onChange={(e) => handleToggleLayer('cadastral', e.target.checked)}
                    className="w-4 h-4 accent-blue-950 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-700 font-medium">Survey Number Labels (सर्व्हे क्र.)</span>
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => handleToggleLayer('labels', e.target.checked)}
                    className="w-4 h-4 accent-blue-950 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Classification Legend */}
            <div>
              <h2 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                Classification Legend
              </h2>
              <div className="space-y-1.5 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-800">
                  <span
                    className="w-3.5 h-3.5 rounded-xs shrink-0 border border-slate-300"
                    style={{ background: TYPE_COLORS.agri.fill }}
                  />
                  <span>Agricultural (कृषी जमीन)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <span
                    className="w-3.5 h-3.5 rounded-xs shrink-0 border border-slate-300"
                    style={{ background: TYPE_COLORS.resi.fill }}
                  />
                  <span>Residential NA (रहिवासी बिनशेती)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <span
                    className="w-3.5 h-3.5 rounded-xs shrink-0 border border-slate-300"
                    style={{ background: TYPE_COLORS.fallow.fill }}
                  />
                  <span>Forest / Public (वन / सरकारी)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10.5px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DILRMP 3.0 Standard</span>
            </div>
            <div>WGS-84 EPSG:4326 • Revenue Directorate</div>
          </div>
        </aside>

        {/* MAP CANVAS CONTAINER */}
        <div className="flex-1 relative h-full bg-slate-200 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Active Sensor Stamp at Top-Left */}
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs shadow-lg z-10 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${selectedYear === 2001 ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span className="font-bold text-slate-100">
                {selectedYear === 2001 ? 'Historical Satellite Archive' : 'Cadastral Satellite Mesh'}
              </span>
              <span className="font-mono font-black text-amber-400 px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10.5px]">
                {selectedYear}
              </span>
            </div>
            <div className="text-[10px] text-slate-300 font-mono">
              Sensor: {TIMELINE_METADATA[selectedYear].satelliteSensor}
            </div>
          </div>

          {/* 2001 Historical Vintage Watermark if 2001 is active */}
          {selectedYear === 2001 && (
            <div className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-600 text-[10.5px] font-black uppercase tracking-wider shadow-md pointer-events-none z-10 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              <span>2001 Baseline Multi-Spectral Imagery</span>
            </div>
          )}

          {/* INTERACTIVE FLOATING TIMELINE SLIDER (Bottom Center) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-950/92 text-white backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-2xl z-20 flex flex-col sm:flex-row items-center gap-3.5">
            {/* Play/Pause Timelapse Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isPlayingTimeline
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isPlayingTimeline ? 'Pause Timelapse' : 'Play Historical Timelapse (2001-2026)'}
              >
                {isPlayingTimeline ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span className="text-[11px] font-sans font-bold hidden sm:inline">
                  {isPlayingTimeline ? 'Pause' : 'Play Timelapse'}
                </span>
              </button>

              <div className="h-5 w-px bg-slate-700 hidden sm:block" />
            </div>

            {/* Year Selector Pills Slider */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {([2001, 2010, 2018, 2026] as TimelineYear[]).map((yr) => (
                <button
                  key={yr}
                  onClick={() => {
                    setSelectedYear(yr);
                    setIsPlayingTimeline(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    selectedYear === yr
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Quick 2001 vs 2026 Toggle Button */}
            <button
              onClick={() => {
                setSelectedYear((prev) => (prev === 2001 ? 2026 : 2001));
                setIsPlayingTimeline(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-200 text-xs font-bold border border-blue-700 transition-all flex items-center gap-1.5"
            >
              <Columns className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedYear === 2001 ? 'Switch to 2026 Present' : 'Inspect 2001 Historical'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT RECORD PANEL */}
        <aside
          className={`bg-white border-l border-slate-200 overflow-hidden transition-all duration-300 ease-in-out shrink-0 z-20 flex flex-col shadow-lg ${
            panelOpen ? 'w-[320px] sm:w-[380px]' : 'w-0'
          }`}
        >
          {selectedParcel ? (
            <div className="w-[320px] sm:w-[380px] h-full overflow-y-auto p-4 space-y-4">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-blue-950 to-slate-900 text-white p-4 rounded-xl space-y-1.5 relative">
                <button
                  onClick={() => setPanelOpen(false)}
                  className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close Record Drawer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Gaon Namuna 7/12 • गाव नमुना ७/१२
                </div>
                <h3 className="font-black text-lg text-white">
                  Survey No. {selectedParcel.id}
                </h3>
                <p className="text-[11px] text-slate-300">
                  {selectedParcel.village}, Taluka: {selectedParcel.taluka}, District: {selectedParcel.district}
                </p>
              </div>

              {/* 2001 vs 2026 Historical Comparison Alert Box */}
              <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                    <History className="w-4 h-4 text-amber-700" />
                    <span>2001 Historical Land Audit</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                    25-Year Ground Truth
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-0.5">
                    <span className="text-amber-900 font-medium">Land Use in 2001:</span>
                    <span className="font-bold text-slate-900 text-right">
                      {selectedParcel.historical2001.landUse}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-amber-900 font-medium">Crop in 2001:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedParcel.historical2001.crop}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-amber-900 font-medium">Owner in 2001:</span>
                    <span className="font-semibold text-slate-800 text-right">
                      {selectedParcel.historical2001.ownerIn2001}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-amber-900 font-medium">Vegetation (NDVI):</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {selectedParcel.historical2001.ndvi}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-amber-900 font-medium">Boundary Verification:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {selectedParcel.historical2001.boundaryIntegrity}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-amber-800 border-t border-amber-200/80">
                  <span>Sensor: {selectedParcel.historical2001.satelliteSensor}</span>
                  <span className="font-mono">{selectedParcel.historical2001.acquisitionDate}</span>
                </div>
              </div>

              {/* 14-Digit Bhu-Aadhaar Badge with Copy */}
              <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-800">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400">
                    14-Digit Bhu-Aadhaar (ULPIN)
                  </div>
                  <div className="font-mono text-xs font-black tracking-wider text-slate-100 mt-0.5">
                    {selectedParcel.ulpin}
                  </div>
                </div>
                <button
                  onClick={() => handleCopyULPIN(selectedParcel.ulpin)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Copy ULPIN"
                >
                  {copiedULPIN ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* RoR 7/12 Key Fields Table */}
              <div className="divide-y divide-slate-100 text-xs border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Registered Khatedar:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[190px] truncate">
                    {selectedParcel.owner}
                  </span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Total Holding Area:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedParcel.area}</span>
                </div>
                <div className="flex justify-between p-2.5 items-center">
                  <span className="text-slate-500 font-medium">Classification:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${TYPE_COLORS[selectedParcel.type].badge}`}>
                    {TYPE_COLORS[selectedParcel.type].name}
                  </span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Current Crop / Use:</span>
                  <span className="font-semibold text-slate-800 text-right">{selectedParcel.crop}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Khata / Account No:</span>
                  <span className="font-mono font-bold text-blue-900">{selectedParcel.khataNumber || 'KH-8821'}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Circle Rate Valuation:</span>
                  <span className="font-mono font-bold text-emerald-700">{selectedParcel.valuation || '₹ 42.50 Lakh'}</span>
                </div>
                <div className="flex justify-between p-2.5">
                  <span className="text-slate-500 font-medium">Bank Lien:</span>
                  <span className="font-semibold text-slate-800 text-right text-[11px] max-w-[180px]">
                    {selectedParcel.encumbrance}
                  </span>
                </div>
              </div>

              {/* Mutation History (e-Ferfar) Timeline */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-900" />
                    e-Ferfar Mutation History (Section 150)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Sanctioned
                  </span>
                </div>

                <div className="relative border-l-2 border-blue-900/30 ml-2 space-y-3 pl-3.5 py-1">
                  {selectedParcel.mutations.map(([date, mutNo, desc], idx) => (
                    <div key={idx} className="relative space-y-0.5 text-xs">
                      <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-900 border border-white" />
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-blue-950 text-[11px]">{mutNo}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{date}</span>
                      </div>
                      <p className="text-slate-600 text-[11.5px] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print 7/12</span>
                </button>
                <Link
                  href={`/check-ownership?surveyNumber=${encodeURIComponent(selectedParcel.id)}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-950/20"
                >
                  <span>Full RoR Extract</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="w-[320px] sm:w-[380px] h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mb-3">
                <Compass className="w-6 h-6 text-blue-900" />
              </div>
              <p className="leading-relaxed">
                Click any cadastral parcel on the map
                <br />
                to inspect its authentic 7/12 extract and 2001 historical satellite imagery.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
