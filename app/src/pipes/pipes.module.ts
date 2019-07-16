import { NgModule } from '@angular/core';
import { NumberFormatterPipe } from './number-formatter/number-formatter';
@NgModule({
	declarations: [NumberFormatterPipe],
	imports: [],
	exports: [NumberFormatterPipe]
})
export class PipesModule {}
