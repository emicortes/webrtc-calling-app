import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-stream-player',
  templateUrl: './stream-player.component.html',
  styleUrls: ['./stream-player.component.scss'],
})
export class StreamPlayerComponent implements OnInit, AfterViewInit {
  @Input()
  stream!: MediaStream;
  @ViewChild('videoContainer')
  videoContainer!: ElementRef;
  constructor() {}
  ngAfterViewInit(): void {
    this.videoContainer.nativeElement.srcObject = this.stream;
    this.videoContainer.nativeElement.play();
  }

  ngOnInit(): void {}
}
