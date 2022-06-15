import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const GoogleMaps = ({getLocation}) => (
  <div>
    <GooglePlacesAutocomplete
      apiKey="AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI&libraries=places&language=en"
      selectProps={{ onChange: (option) => getLocation(option.label)}}
    />
  </div>
);

export default GoogleMaps;