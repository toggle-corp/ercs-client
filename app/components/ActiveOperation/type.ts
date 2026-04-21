import type { AdminZeroFeatureProperties } from '#components/GlobalMap';

 interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type AppealResponse = PaginatedResponse<DisasterResponse>;

export interface DisasterResponse {
  aid: string;
  id: string;
  name: string;
  dtype: DisasterType;
  atype: number;
  atype_display: string;
  status: number;
  status_display: string;
  code: string;
  sector: string;
  num_beneficiaries: number;
  amount_requested: number;
  amount_funded: number;
  start_date: string;
  end_date: string;
  real_data_update: string;
  created_at: string;
  modified_at: string;
  event: number | null;
  needs_confirmation: boolean;
  country: Country;
  region: Region;
}

export interface DisasterType {
  id: number;
  summary: string;
  name: string;
  translation_module_original_language: string;
}

export interface Country {
  iso: string;
  iso3: string;
  id: number;
  record_type: number;
  record_type_display: string;
  region: number;
  independent: boolean;
  is_deprecated: boolean;
  fdrs: string;
  average_household_size: number | null;
  society_name: string;
  name: string;
  translation_module_original_language: string;
}

export interface Region {
  name: number;
  id: number;
  region_name: string;
  label: string;
  translation_module_original_language: string;
}

export type AppealTypeOption = {
  key: number;
  value: string;
};

export type AppealListItem = NonNullable<AppealResponse['results']>[number];

export interface ClickedPoint {
    featureProperties: AdminZeroFeatureProperties;
    lngLat: mapboxgl.LngLatLike;
}

type EmergencyType = {
  id: number;
  name: string;
  summary: string;
  translation_module_original_language: string;
};

export type EmergencyTypeListResponse = PaginatedResponse<EmergencyType>;

type GeoPolygon = {
    type: 'Polygon';
    coordinates: number[][][];
};

type GeoPoint = {
    type: 'Point';
    coordinates: number[];
};

export type CountryDataType = {
    iso: string;
    iso3: string;
    society_url: string;
    region: number;
    key_priorities: string | null;
    inform_score: number | null;
    id: number;
    url_ifrc: string;
    record_type: number;
    record_type_display: string;
    bbox: GeoPolygon;
    centroid: GeoPoint;
    independent: boolean;
    is_deprecated: boolean;
    fdrs: string;
    links: unknown[];
    address_1: string;
    address_2: string;
    city_code: string;
    phone: string;
    website: string;
    emails: string[];
    society_name: string;
    name: string;
    overview: string | null;
    translation_module_original_language: string;
};

export type CountryDataTypeResponse = PaginatedResponse<CountryDataType>;
