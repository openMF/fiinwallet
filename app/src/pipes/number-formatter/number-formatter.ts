import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberFormatter',
})
export class NumberFormatterPipe implements PipeTransform {

  transform(value: number, ...args: any[]): string {
    if (value) {
      const options = {};

      if (args.length > 0) {
        args.forEach(arg => {
          if (arg === 'price') {
            if (parseFloat(value.toString(10)) >= 100) {
              options['minimumFractionDigits'] = 0;
              options['maximumFractionDigits'] = 0;
            }
            if (parseFloat(value.toString(10)) < 100) {
              options['minimumFractionDigits'] = 2;
              options['maximumFractionDigits'] = 2;
            }
            if (parseFloat(value.toString(10)) < 0.01) {
              options['minimumFractionDigits'] = 3;
              options['maximumFractionDigits'] = 3;
            }
            if (parseFloat(value.toString(10)) < 0.001) {
              options['minimumFractionDigits'] = 4;
              options['maximumFractionDigits'] = 4;
            }
            if (parseFloat(value.toString(10)) < 0.0001) {
              options['minimumFractionDigits'] = 5;
              options['maximumFractionDigits'] = 5;
            }
            if (parseFloat(value.toString(10)) < 0.00001) {
              options['minimumFractionDigits'] = 6;
              options['maximumFractionDigits'] = 6;
            }
            if (parseFloat(value.toString(10)) <= 0) {
              options['minimumFractionDigits'] = 0;
              options['maximumFractionDigits'] = 0;
            }
          }

          if (arg === 'perc') {
            options['maximumFractionDigits'] = 2;
          }
        });
      } else {
        options['minimumFractionDigits'] = 0;
        options['maximumFractionDigits'] = 0;
      }

      return new Intl.NumberFormat('de-DE', options).format(value);
    }

    return null;
  }
}
