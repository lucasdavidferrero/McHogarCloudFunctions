/*

What to Test
1) Static Method: prepararSincronizacion
* Ensure the method correctly fetches data from the services.
* Validate that data transformation functions are called with the correct arguments.
* Verify that the filtering logic works as expected.
* Check that the correct Prisma update promises are returned.

2) Helper Methods
* fromListadoCompletoAikonArticulosToAikonArticulosObject: Ensure it transforms the array into an object correctly.
* transformarArticuloAikonApiToArticuloPrisma: Validate the transformation from API data to Prisma-compatible data.
* transformarConvertirArticuloPrismaToArticuloPrecioPrisma: Ensure the combination of article data with price data is accurate.

*/
// import { SyncArticuloInfoRelevante, fetchAllAikonArticulosWithSelectSubsetReturnValue } from './SyncArticuloInfoRelevante';
import { AikonApiDtTablaService } from '../../servicios/AikonApiDtTablaService';
// import { PrismaService } from '../../servicios/PrismaService';
// import { DateUtils } from '../../../utils/DateUtils';
import { DtTablaArticuloData, DtTablaPrecioData } from '../../entidades/AikonApiTypes';

import * as dtTablaArticuloDataMock from "./mocks/DtTablaArticuloDataMock.json" ;
import * as dtTablaPreciosDataMock from "./mocks/DtTablaPreciosDataMock.json";

// Mock dependencies
jest.mock('../../servicios/AikonApiDtTablaService');
jest.mock('../../servicios/PrismaService');
jest.mock('../../../utils/DateUtils');

describe('SyncArticuloInfoRelevante', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('prepararSincronizacion', () => {
        it('should fetch data from services and process it correctly', async () => {
            // Arrange
            const token = 'test-token';
            const mockArticuloData: { data: DtTablaArticuloData[] } = { data: (dtTablaArticuloDataMock as DtTablaArticuloData[])};
            const mockPrecioData: { data: DtTablaPrecioData[] } = { data: (dtTablaPreciosDataMock as DtTablaPrecioData[]) };
            // const mockPrismaData: fetchAllAikonArticulosWithSelectSubsetReturnValue[] = [];

            (AikonApiDtTablaService.fetchArticulos as jest.Mock).mockResolvedValue(mockArticuloData);
            (AikonApiDtTablaService.fetchPrecios as jest.Mock).mockResolvedValue(mockPrecioData);

            // Act
            // const result = await SyncArticuloInfoRelevante.prepararSincronizacion(token);

            // Assert
            expect(AikonApiDtTablaService.fetchArticulos).toHaveBeenCalledWith(token);
            expect(AikonApiDtTablaService.fetchPrecios).toHaveBeenCalledWith(token);
        });
    });

    describe('fromListadoCompletoAikonArticulosToAikonArticulosObject', () => {
        it('should transform array to object correctly', () => {
           
        });
    });

    describe('transformarArticuloAikonApiToArticuloPrisma', () => {
        it('should transform API data to Prisma data correctly', () => {
      
        });
    });

    describe('transformarConvertirArticuloPrismaToArticuloPrecioPrisma', () => {
        it('should combine article and price data correctly', () => {
           
        });
    });
});

export {}