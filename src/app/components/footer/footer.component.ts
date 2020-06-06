import { Component, OnInit } from '@angular/core';
import { IAdvice } from 'src/app/shared/interfaces/advice.interface';
import { IQuote } from 'src/app/shared/interfaces/quote.interface';
import { QuoteService } from 'src/app/shared/services/quote.service';
import { AdviceService } from 'src/app/shared/services/advice.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  arrAdvice: Array<IAdvice> = [];
  arrQuote: Array<IQuote> = [];

  constructor(
    private quoteService: QuoteService,
    private adviceService: AdviceService
  ) { }

  ngOnInit(): void {
    this.getOneQuote();
    this.getOneAdvice();
  }

  private getOneQuote() {
    this.quoteService.getLimitQuotesFirebade(1).subscribe(
      data => {
        this.arrQuote = data;
      });
  }

  private getOneAdvice() {
    this.adviceService.getLimitAdvicesFirebade(1).subscribe(
      data => {
        this.arrAdvice = data;
      });
  }

  public goTop() {
    window.scrollTo(0, 0);
  }

}
