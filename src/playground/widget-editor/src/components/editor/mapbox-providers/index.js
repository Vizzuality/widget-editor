import CartoProvider from '@vizzuality/layer-manager-provider-carto';

import WMSProvider from './wms';
import GeeProvider from './gee';
import FeatureServiceProvider from './feature-service';

const cartoProvider = new CartoProvider();
const wmsProvider = new WMSProvider();
const geeProvider = new GeeProvider();
const featureServiceProvider = new FeatureServiceProvider();

const providers = {
  [wmsProvider.name]: wmsProvider.handleData,
  [geeProvider.name]: geeProvider.handleData,
  [cartoProvider.name]: cartoProvider.handleData,
  [featureServiceProvider.name]: featureServiceProvider.handleData,
};

export default providers;
