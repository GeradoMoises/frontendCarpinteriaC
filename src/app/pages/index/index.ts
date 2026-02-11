import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../core/header/header';
import {TopbarComponent} from '../dashboard/fragments/topbar/topbar';
import {FooterComponent} from '../../core/footer/footer';
import {NavbarComponent} from '../../core/navbar/navbar';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, NavbarComponent],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class IndexComponent implements AfterViewInit {

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    // Evita errores con SSR (document/window no existen en server)
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.el.nativeElement;

    // Filtros de trabajos
    const workChips = root.querySelectorAll<HTMLElement>('#workChips .chip');
    const workItems = root.querySelectorAll<HTMLElement>('.work-item');

    workChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.getAttribute('data-filter');

        workChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        workItems.forEach(item => {
          const cat = item.getAttribute('data-cat');
          const show = (filter === 'all' || filter === cat);
          item.style.display = show ? '' : 'none';
        });
      });
    });

    // Modal: cargar imagen/título/desc
    const modalImg = root.querySelector<HTMLImageElement>('#workModalImg');
    const modalTitle = root.querySelector<HTMLElement>('#workModalTitle');
    const modalDesc = root.querySelector<HTMLElement>('#workModalDesc');

    root.querySelectorAll<HTMLElement>('.work-card').forEach(btn => {
      btn.addEventListener('click', () => {
        if (modalImg) modalImg.src = btn.getAttribute('data-img') || '';
        if (modalTitle) modalTitle.textContent = btn.getAttribute('data-title') || 'Trabajo';
        if (modalDesc) modalDesc.textContent = btn.getAttribute('data-desc') || '';
      });
    });
  }
}
