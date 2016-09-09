export type DimensionTransformer = {
  convertToBase: (value: number) => number,
  convertFromBase: (value: number) => number,
};
export type DimensionDescriptor = { [key: string]: number };
export type UnitDescriptor = [number | DimensionTransformer, DimensionDescriptor];
export type UnitName = string;

const BASE_TIME = 'second';
const BASE_LENGTH = 'meter';
const BASE_WEIGHT = 'kilogram';
const BASE_CURRENCY = 'euro';
const BASE_MEMORY = 'bit';
const BASE_ABSOLUTE_TEMPERATURE = 'kelvin';

const timeDimensions = { [BASE_TIME]: 1 };
const lengthDimensions = { [BASE_LENGTH]: 1 };
const weightDimensions = { [BASE_WEIGHT]: 1 };
const areaDimensions = { [BASE_LENGTH]: 2 };
const volumeDimensions = { [BASE_LENGTH]: 3 };
const energyDimensions = { [BASE_WEIGHT]: 1, [BASE_LENGTH]: 2, [BASE_TIME]: -2 };
const powerDimensions = { [BASE_WEIGHT]: 1, [BASE_LENGTH]: 2, [BASE_TIME]: -3 };
const memoryDimensions = { [BASE_MEMORY]: 1 };
const currencyDimensions = { [BASE_CURRENCY]: 1 };
const absoluteTemperatureDimensions = { [BASE_ABSOLUTE_TEMPERATURE]: 1 };
const noDimensions = {};

// TODO: Copy from https://github.com/gentooboontoo/js-quantities/blob/master/src/quantities.js

/* eslint-disable quote-props, no-multi-spaces, indent, max-len */
const unitDescriptors: { [key: UnitName]: UnitDescriptor } = {
               'second': [1,                             timeDimensions],
               'minute': [60,                            timeDimensions],
                 'hour': [3600,                          timeDimensions],
                  'day': [86400,                         timeDimensions],
              'weekday': [120960,                        timeDimensions],
                 'week': [604800,                        timeDimensions],
            'fortnight': [1209600,                       timeDimensions],
                'month': [2628000,                       timeDimensions],
                 'year': [31536000,                      timeDimensions],
               'decade': [315360000,                     timeDimensions],
              'century': [3155673600,                    timeDimensions],

                'meter': [1,                             lengthDimensions],
                 'inch': [0.0254,                        lengthDimensions],
                 'foot': [0.3048,                        lengthDimensions],
                 'yard': [0.9144,                        lengthDimensions],
                 'mile': [1609,                          lengthDimensions],
               'league': [4827,                          lengthDimensions],
               'fathom': [1.8288,                        lengthDimensions],
              'furlong': [201,                           lengthDimensions],
           'light year': [9.4605284e15,                  lengthDimensions],
               'parsec': [3.086e16,                      lengthDimensions],
             'angstrom': [1e-10,                         lengthDimensions],
        'nautical mile': [1852,                          lengthDimensions],

                 'gram': [1e-3,                          weightDimensions],
                'tonne': [1e3,                           weightDimensions],
                'ounce': [0.0283495,                     weightDimensions],
                'pound': [0.453592,                      weightDimensions],
                'stone': [6.35029,                       weightDimensions],

                 'acre': [4047,                          areaDimensions],
              'hectare': [1e4,                           areaDimensions],

                'liter': [1e-3,                          volumeDimensions],
               'gallon': [4.54609e-3,                    volumeDimensions],
            'us gallon': [3.785e-3,                      volumeDimensions],
                'quart': [9.464e-4,                      volumeDimensions],
                  'cup': [2.4e-4,                        volumeDimensions],
               'US cup': [2.3559e-4,                     volumeDimensions],
             'teaspoon': [4.929e-6,                      volumeDimensions],
           'tablespoon': [1.479e-5,                      volumeDimensions],
                 'drop': [5e-8,                          volumeDimensions],
          'fluid ounce': [2.8413e-5,                     volumeDimensions],

                'Joule': [1,                             energyDimensions],
              'Calorie': [4.184,                         energyDimensions],
        'electron volt': [1.602e-19,                     energyDimensions],
                  'BTU': [1055,                          energyDimensions],
                'therm': [1055000000,                    energyDimensions],

                         // We also have absolute temperatures below
       'degrees kelvin': [1.4e-23,                       energyDimensions],
      'degrees celsius': [1.4e-23,                       energyDimensions],
   'degrees fahrenheit': [7.7777777778e-23,              energyDimensions],
      'degrees rankine': [7.7777777778e-23,              energyDimensions],

                 'Watt': [1,                             powerDimensions],

                  'bit': [1,                             memoryDimensions],
                 'byte': [8,                             memoryDimensions],

                  'AUD': [1,                             currencyDimensions],
                  'BGN': [1,                             currencyDimensions],
                  'BRL': [1,                             currencyDimensions],
                  'CAD': [1,                             currencyDimensions],
                  'CHF': [1,                             currencyDimensions],
                  'CNY': [1,                             currencyDimensions],
                  'CZK': [1,                             currencyDimensions],
                  'DKK': [1,                             currencyDimensions],
                  'EUR': [1,                             currencyDimensions],
                  'GBP': [1,                             currencyDimensions],
                  'HKD': [1,                             currencyDimensions],
                  'HRK': [1,                             currencyDimensions],
                  'HUF': [1,                             currencyDimensions],
                  'IDR': [1,                             currencyDimensions],
                  'ILS': [1,                             currencyDimensions],
                  'INR': [1,                             currencyDimensions],
                  'JPY': [1,                             currencyDimensions],
                  'KRW': [1,                             currencyDimensions],
                  'MXN': [1,                             currencyDimensions],
                  'MYR': [1,                             currencyDimensions],
                  'NOK': [1,                             currencyDimensions],
                  'NZD': [1,                             currencyDimensions],
                  'PHP': [1,                             currencyDimensions],
                  'PLN': [1,                             currencyDimensions],
                  'RON': [1,                             currencyDimensions],
                  'RUB': [1,                             currencyDimensions],
                  'SEK': [1,                             currencyDimensions],
                  'SGD': [1,                             currencyDimensions],
                  'THB': [1,                             currencyDimensions],
                  'TRY': [1,                             currencyDimensions],
                  'USD': [1,                             currencyDimensions],
                  'ZAR': [1,                             currencyDimensions],

          'femtosecond': [1e-15,                         timeDimensions],
           'picosecond': [1e-12,                         timeDimensions],
           'nanosecond': [1e-9,                          timeDimensions],
          'microsecond': [1e-6,                          timeDimensions],
          'millisecond': [1e-3,                          timeDimensions],

           'femtometer': [1e-15,                         lengthDimensions],
            'picometer': [1e-12,                         lengthDimensions],
            'nanometer': [1e-9,                          lengthDimensions],
           'micrometer': [1e-6,                          lengthDimensions],
           'millimeter': [1e-3,                          lengthDimensions],
           'centimeter': [1e-2,                          lengthDimensions],
            'kilometer': [1e3,                           lengthDimensions],
            'megameter': [1e6,                           lengthDimensions],
            'gigameter': [1e9,                           lengthDimensions],
            'terameter': [1e12,                          lengthDimensions],
            'petameter': [1e15,                          lengthDimensions],

            'femtogram': [1e-18,                         weightDimensions],
             'picogram': [1e-15,                         weightDimensions],
             'nanogram': [1e-12,                         weightDimensions],
            'microgram': [1e-9,                          weightDimensions],
            'milligram': [1e-6,                          weightDimensions],
             'kilogram': [1,                             weightDimensions],
             'megagram': [1e3,                           weightDimensions],
             'gigagram': [1e6,                           weightDimensions],
             'teragram': [1e9,                           weightDimensions],
             'petagram': [1e12,                          weightDimensions],

           'milliliter': [1e-6,                          volumeDimensions],
           'centiliter': [1e-5,                          volumeDimensions],

           'femtojoule': [1e-15,                         energyDimensions],
            'picojoule': [1e-12,                         energyDimensions],
            'nanojoule': [1e-9,                          energyDimensions],
           'microjoule': [1e-6,                          energyDimensions],
           'millijoule': [1e-3,                          energyDimensions],
           'centijoule': [1e-2,                          energyDimensions],
            'kilojoule': [1e3,                           energyDimensions],
            'megajoule': [1e6,                           energyDimensions],
            'gigajoule': [1e9,                           energyDimensions],
            'terajoule': [1e12,                          energyDimensions],
            'petajoule': [1e15,                          energyDimensions],

            'femtowatt': [1e-15,                         powerDimensions],
             'picowatt': [1e-12,                         powerDimensions],
             'nanowatt': [1e-9,                          powerDimensions],
            'microwatt': [1e-6,                          powerDimensions],
            'milliwatt': [1,                             powerDimensions],
             'kilowatt': [1e3,                           powerDimensions],
             'megawatt': [1e6,                           powerDimensions],
             'gigawatt': [1e9,                           powerDimensions],
             'terawatt': [1e12,                          powerDimensions],
             'petawatt': [1e15,                          powerDimensions],

              'kilobit': [1e3,                           memoryDimensions],
              'megabit': [1e6,                           memoryDimensions],
              'gigabit': [1e9,                           memoryDimensions],
              'terabit': [1e12,                          memoryDimensions],
              'petabit': [1e15,                          memoryDimensions],
              'kibibit': [1024,                          memoryDimensions],
              'mebibit': [1048576,                       memoryDimensions],
              'gibibit': [1073741824,                    memoryDimensions],
              'tebibit': [1099511627776,                 memoryDimensions],
              'pebibit': [1125899906842624,              memoryDimensions],

             'kilobyte': [8e3,                           memoryDimensions],
             'megabyte': [8e6,                           memoryDimensions],
             'gigabyte': [8e9,                           memoryDimensions],
             'terabyte': [8e12,                          memoryDimensions],
             'petabyte': [8e15,                          memoryDimensions],
             'kibibyte': [8192,                          memoryDimensions],
             'mebibyte': [8388608,                       memoryDimensions],
             'gibibyte': [8589934592,                    memoryDimensions],
             'tebibyte': [8796093022208,                 memoryDimensions],
             'pebibyte': [9007199254740992,              memoryDimensions],

              'percent': [0.01,                          noDimensions],
               'degree': [0.0174532925199432957692369,   noDimensions],
               'radian': [1,                             noDimensions],
            'arcminute': [0.000290888208665721596153948, noDimensions],
            'arcsecond': [4.848136811095359935899141e-6, noDimensions],

                         // TODO: Rankine
               'kelvin': [1.4e-23,                       absoluteTemperatureDimensions],
              'celsius': [{
                           convertToBase: value => value - 273.15,
                           convertFromBase: value => value + 273.15,
                         }, absoluteTemperatureDimensions],
           'fahrenheit': [{
                           convertToBase: value => ((value - 273.15) * 1.8) + 32,
                           convertFromBase: value => ((value - 32) / 1.8) + 273.15,
                         }, absoluteTemperatureDimensions],
};
/* eslint-enable */

export default unitDescriptors;
