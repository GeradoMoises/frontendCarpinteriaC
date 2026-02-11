import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {NavbarComponent} from '../../core/navbar/navbar';
import {FooterComponent} from '../../core/footer/footer';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  templateUrl: './nosotros.html',
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // ✅ Solo en navegador
    if (!isPlatformBrowser(this.platformId)) return;

    this.initMetricCounter();
  }

  private initMetricCounter(): void {
    const metrics = document.querySelector('.hero-metrics');
    if (!metrics) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(metrics);
  }

  private animateCounters(): void {
    const elements = document.querySelectorAll<HTMLElement>('.metric-value[data-count]');

    elements.forEach(el => {
      const target = Number(el.dataset['count']);
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current.toString();
      }, 18);
    });
  }
}
