import { TestBed } from "@angular/core/testing";
import { TableDataService } from "../services/table-data.service";
import { RegularTablesResolver, ExtendedTablesResolver, SmartTablesResolver } from "./tables.resolver";

describe('RegularTablesResolver', () => {
  let resolver: RegularTablesResolver;
  let tableDataService: jasmine.SpyObj<TableDataService>;

  beforeEach(() => {
    tableDataService = jasmine.createSpyObj('TableDataService', ['getRegularTableData']);
    TestBed.configureTestingModule({
      providers: [
        RegularTablesResolver,
        { provide: TableDataService, useValue: tableDataService }
      ]
    });
    resolver = TestBed.get(RegularTablesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve data', () => {
    const mockTableData = {};
    tableDataService.getRegularTableData.and.returnValue(Promise.resolve(mockTableData));

    resolver.resolve().then(result => {
      expect(result).toEqual({ data: mockTableData });
    });
  });
});

describe('ExtendedTablesResolver', () => {
  let resolver: ExtendedTablesResolver;
  let tableDataService: jasmine.SpyObj<TableDataService>;

  beforeEach(() => {
    tableDataService = jasmine.createSpyObj('TableDataService', ['getExtendedTableData']);
    TestBed.configureTestingModule({
      providers: [
        ExtendedTablesResolver,
        { provide: TableDataService, useValue: tableDataService }
      ]
    });
    resolver = TestBed.get(ExtendedTablesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve data', () => {
    const mockTableData = {};
    tableDataService.getExtendedTableData.and.returnValue(Promise.resolve(mockTableData));

    resolver.resolve().then(result => {
      expect(result).toEqual({ data: mockTableData });
    });
  });
});

describe('SmartTablesResolver', () => {
  let resolver: SmartTablesResolver;
  let tableDataService: jasmine.SpyObj<TableDataService>;

  beforeEach(() => {
    tableDataService = jasmine.createSpyObj('TableDataService', ['getSmartTableData']);
    TestBed.configureTestingModule({
      providers: [
        SmartTablesResolver,
        { provide: TableDataService, useValue: tableDataService }
      ]
    });
    resolver = TestBed.get(SmartTablesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve data', () => {
    const mockTableData = {};
    tableDataService.getSmartTableData.and.returnValue(Promise.resolve(mockTableData));

    resolver.resolve().then(result => {
      expect(result).toEqual({ data: mockTableData });
    });
  });
});