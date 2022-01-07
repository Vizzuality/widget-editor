import CartoProvider from '@vizzuality/layer-manager-provider-carto';

const cartoProvider = new CartoProvider();

const providers = {
  [cartoProvider.name]: cartoProvider.handleData,
};

// TODO: allow to pass providers to widget editor
export default providers;
