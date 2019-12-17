import {ClothesRepository} from './data/repository/ClothesRepository';
import {ContainerModule, interfaces} from 'inversify';
import {ClothesController} from './web/ClothesController';
import {ClothesResponseMapper} from './application/mapper/ClothesResponseMapper';
import {Mapper} from '../../core/common/Mapper';
import {ClothesEntity} from './data/entities/ClothesEntity';
import {ClothesResponse} from './data/response/ClothesResponse';
import {ClothesInteractionServices} from './application/services/ClothesInteractionServices';
import {FirstSourcesRepository} from './data/repository/FirstSourcesRepository';
import {SecondSourcesRepisitory} from './data/repository/SecondSourcesRepisitory';

export default new ContainerModule((
    bind: interfaces.Bind,
    unbind: interfaces.Unbind,
    isBound: interfaces.IsBound,
    rebind: interfaces.Rebind
) => {
    bind(ClothesRepository).toSelf();
    bind(ClothesController).toSelf();
    bind(ClothesInteractionServices).toSelf();
    bind(FirstSourcesRepository).toSelf();
    bind(SecondSourcesRepisitory).toSelf();
    bind<Mapper<ClothesEntity, ClothesResponse>>(ClothesResponseMapper).toSelf()
});
