import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { myCardsResolver } from './my-cards.resolver';

describe('myCardsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => myCardsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
