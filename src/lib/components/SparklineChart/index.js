/**
 * @fileoverview Element that renders data as a spark line.
 */

import {svg} from "lit-element";
import {BaseElement} from "../BaseElement";

/**
 * @typedef {{
 *   x: number,
 *   y: number,
 *   score: number,
 *   date: string,
 * }}
 */
let DataPoint; // eslint-disable-line no-unused-vars

/**
 * @typedef {{
 *   points: string,
 *   lastPoint: {x: number, y: number},
 *   firstPoint: {x: number, y: number},
 *   color: string,
 * }}
 */
let PathPart; // eslint-disable-line no-unused-vars

/**
 * @param {number} val to round
 * @return {number} number rounded to two decimals
 */
function clampTo2Decimals(val) {
  return Math.round(val * 100) / 100;
}

/**
 * Render a sparkline.
 * @extends {BaseElement}
 * @final
 */
class SparklineChart extends BaseElement {
  constructor() {
    super();

    /** @private {!Array<!LighthouseScore>} */
    this.values_ = [];

    /** @private {?Promise<!Array<!LighthouseScore>>} */
    this.mediansPromise_ = null;

    /** @private {!Array<!LighthouseScore>} */
    this.medians_ = [];

    /** @private {number} */
    this.stroke_ = 2;
    /** @private {number} */
    this.circleRadius_ = 3;
    /** @private {number} */
    this.padding_ = 0;
    /** @private {number} */
    this.scoreHeight_ = 15;
    /** @private {number} */
    this.transformY_ = this.scoreHeight_ + 30;

    /** @private {?number} */
    this.width_ = null;
    /** @private {?number} */
    this.height_ = null;

    /** @private {?HTMLElement} */
    this.cursor_ = null;
    /** @private {?HTMLElement} */
    this.score_ = null;
    /** @private {?HTMLElement} */
    this.scoreValueText_ = null;
    /** @private {?HTMLElement} */
    this.scoreDateText_ = null;
    /** @private {?HTMLElement} */
    this.announcer_ = null;

    /** @private {?DataPoint} */
    this.point_ = null;

    /** @export {!Array<!DataPoint>} */
    this.datapoints = [];
  }

  /** @export @override */
  static get observedAttributes() {
    return ["fill", "showlast"];
  }

  /**
   * @return {!Array<!LighthouseScore>}
   * @export
   */
  get values() {
    return this.values_;
  }

  /**
   * @param {!Array<!LighthouseScore>} val
   * @export
   */
  set values(val) {
    this.values_ = val;
    this.update_();
  }

  /**
   * @return {?Promise<!Array<!LighthouseScore>>} val
   * @export
   */
  get medians() {
    return this.mediansPromise_;
  }

  /**
   * @param {?Promise<!Array<!LighthouseScore>>} val
   * @export
   */
  set medians(val) {
    // nb. Because `Promise.resolve` is used, this could accept a non-Promise.
    const localPromise = Promise.resolve(val || []);
    this.mediansPromise_ = localPromise;

    localPromise.then((medians) => {
      if (localPromise !== this.mediansPromise_) {
        return; // something changed
      }
      this.medians_ = medians;
      this.update_();
    });
  }

  /**
   * @return {boolean}
   * @export
   */
  get fill() {
    return this.hasAttribute("fill");
  }

  /**
   * @param {boolean} val
   * @export
   */
  set fill(val) {
    if (Boolean(val)) {
      this.setAttribute("fill", "");
    } else {
      this.removeAttribute("fill");
    }
  }

  /**
   * @return {boolean}
   * @export
   */
  get showlast() {
    return this.hasAttribute("showlast");
  }

  /**
   * @param {boolean} val
   * @export
   */
  set showlast(val) {
    if (Boolean(val)) {
      this.setAttribute("showlast", "");
    } else {
      this.removeAttribute("showlast");
    }
  }

  /**
   * @param {?DataPoint} point
   * @export
   */
  set point(point) {
    this.point_ = point;
    if (point) {
      const date = new Date(point.date).toLocaleDateString();
      this.announce_(`Score ${point.score} on date ${date}`);
    }
    if (!(this.cursor_ && this.score_)) {
      return;
    }

    // Clear the point if it was drawn on the screen.
    if (!this.point_) {
      this.cursor_.setAttribute("x1", -10000);
      this.cursor_.setAttribute("x2", -10000);
      this.score_.setAttribute("transform", `translate(-10000,-10000)`);
      return;
    }

    // Draw the point on the screen.
    this.cursor_.setAttribute("x1", this.point_.x);
    this.cursor_.setAttribute("x2", this.point_.x);
    this.cursor_.setAttribute("y1", this.point_.y);
    this.cursor_.setAttribute("y2", this.height_ + this.transformY_);
    const colorClass = this.computeColorClass_(this.point_.score);
    this.cursor_.style.stroke = colorClass;
    this.cursor_.classList.value = colorClass;

    // Set text first, then measure.
    this.scoreValueText_.textContent = this.point_.score;
    try {
      this.scoreDateText_.textContent = new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
      }).format(new Date(this.point_.date));
    } catch (err) {
      this.scoreDateText_.textContent = new Date(
        this.point_.date,
      ).toLocaleDateString();
    }

    const PADDING = 3;

    const scoreHoverRectWidth = this.score_.getBoundingClientRect().width;
    const x = Math.max(
      PADDING,
      Math.min(
        this.width_ - scoreHoverRectWidth - 2 * PADDING,
        this.point_.x - scoreHoverRectWidth / 2,
      ),
    );
    const y = Math.max(
      -1 * (this.height_ / 2),
      Math.min(this.height_ / 2 - PADDING - 10, this.point_.y - 10),
    );

    // Position score/date centered on the hover card.
    const scoreTextWidth = this.scoreValueText_.getBoundingClientRect().width;
    const dateTextWidth = this.scoreDateText_.getBoundingClientRect().width;
    this.scoreDateText_.setAttribute(
      "x",
      scoreHoverRectWidth / 2 - dateTextWidth / 2,
    );
    this.scoreValueText_.setAttribute(
      "x",
      scoreHoverRectWidth / 2 - scoreTextWidth / 2,
    );
    this.score_.setAttribute("transform", `translate(${x},${y})`);
    this.score_.style.fill = colorClass;
    this.score_.classList.value = colorClass;
  }

  /**
   * @return {?DataPoint}
   * @export
   */
  get point() {
    return this.point_;
  }

  /** @export @override */
  /* eslint-disable-next-line */
  attributeChangedCallback(attr, oldValue, newValue, namespace) {
    this.update_();
  }

  /** @export @override */
  connectedCallback() {
    this.update_(); // generate DOM.
    this.setAttribute("aria-valuemin", 0);
    this.setAttribute("aria-valuemax", 100);

    this.tabIndex = 0;
    this.setAttribute("role", "group");
    this.setAttribute(
      "aria-label",
      "scores over time. Use arrow keys to navigate",
    );

    window.addEventListener("resize", this.update_);
    this.addEventListener("mousemove", this.onMouseMove_);
    this.addEventListener("mouseout", this.onMouseOut_);
    this.addEventListener("keydown", this.onKeyDown_);
    this.addEventListener("blur", this.onBlur_);
  }

  /** @export @override */
  disconnectedCallback() {
    this.eventHandler_.removeAll();
  }

  /**
   * @private
   * @param {!goog.events.BrowserEvent} e
   */
  onMouseMove_(e) {
    // TODO(b/117590606): Make this work with touch events.
    const mouseX = e.offsetX;

    const nextDataPointIdx = this.datapoints.findIndex(
      (entry) => entry.x >= mouseX,
    );
    const prevPoint = this.datapoints[nextDataPointIdx - 1];
    const nextPoint = this.datapoints[nextDataPointIdx];

    let point;
    if (!nextPoint) {
      point = this.datapoints[this.datapoints.length - 1];
    } else if (!prevPoint) {
      point = this.datapoints[0];
    } else {
      if (Math.abs(mouseX - prevPoint.x) <= Math.abs(mouseX - nextPoint.x)) {
        point = prevPoint;
      } else {
        point = nextPoint;
      }
    }

    this.point = point;
  }

  /**
   * @private
   * @param {!goog.events.BrowserEvent} e
   */
  onMouseOut_(e) {
    this.point = null;
  }

  /**
   * @private
   * @param {!goog.events.BrowserEvent} e
   */
  onKeyDown_(e) {
    switch (e.key) {
      case Keys.RIGHT:
        e.preventDefault();
        this.setNextPoint_();
        break;

      case Keys.LEFT:
        e.preventDefault();
        this.setPrevPoint_();
        break;
    }
  }

  /**
   * Set the next point that should be drawn to the screen.
   * @private
   */
  setNextPoint_() {
    const cursorX = this.cursor_.getAttribute("x1");
    const nextPoint = this.datapoints.find((entry) => entry.x > cursorX);

    let point;
    if (!nextPoint) {
      point = this.datapoints[this.datapoints.length - 1];
    } else {
      point = nextPoint;
    }

    if (point) {
      this.point = point;
    }
  }

  /**
   * Set the previous point that should be drawn to the screen.
   * @private
   */
  setPrevPoint_() {
    const cursorX = this.cursor_.getAttribute("x1");
    const currentPointIdx = this.datapoints.findIndex(
      (entry) => entry.x == cursorX,
    );
    const prevPoint = this.datapoints[currentPointIdx - 1];

    let point;
    if (!prevPoint) {
      point = this.datapoints[0];
    } else {
      point = prevPoint;
    }

    if (point) {
      this.point = point;
    }
  }

  /**
   * Clear the point if it has been drawn to the screen.
   * @private
   * @param {!goog.events.BrowserEvent} e
   */
  onBlur_(e) {
    this.point = null;
  }

  /**
   * Announce content for screen readers using an ARIA live region.
   * @private
   * @param {string} msg
   */
  announce_(msg) {
    this.announcer_.textContent = msg;
    window.setTimeout(() => {
      this.announcer_.textContent = "";
    }, 100);
  }

  /**
   * Calculate the data point y's value
   * @param {number} y
   * @return {number}
   */
  calculateY(y) {
    const min = 0;
    const max = this.height_;
    if (!max) {
      return 0; // not on page yet
    }

    const s = max !== min ? this.height_ / (max - min) : 1;
    return this.height_ - s * (y - min);
  }

  /**
   * Generates the line path from values.
   * @param {!Array<!LighthouseScore>} values Values to generate a path from.
   * @param {boolean=} updateDataPoints Updates .datapoints property if true.
   *     Defaults to true.
   * @return {!Array<!PathPart>}
   * @private
   */
  generatePath_(values, updateDataPoints = true) {
    if (values.length === 0) {
      return [
        {
          points: "M0 0 L0 0",
          firstPoint: {x: 0, y: 0},
          lastPoint: {x: 0, y: 0},
          color: "",
        },
      ];
    }

    const offset =
      values.length > 1 ? Math.floor(this.width_ / (values.length - 1)) : 0;

    const paths = /** @type {!Array<!PathPart>} */ ([]);

    let points = `M0 ${this.calculateY(values[0].score).toFixed(2)}`;
    let firstPoint = {x: NaN, y: NaN};
    let lastPoint = {x: NaN, y: NaN};
    let prevColor;

    if (updateDataPoints) {
      this.datapoints = [];
    }

    values.forEach((value, i) => {
      const x = i * offset;
      const y = parseFloat(this.calculateY(value.score).toFixed(2));
      const isFirstPoint = i === 0;
      const isLastPoint = i === values.length - 1;
      const currColor = this.computeColorClass_(value.score);

      if (isFirstPoint) {
        firstPoint = {x, y};
      } else if (prevColor !== currColor) {
        paths.push({firstPoint, lastPoint, color: prevColor, points});
        points = `M${lastPoint.x} ${lastPoint.y} L${lastPoint.x} ${lastPoint.y}`;
        firstPoint = {x: lastPoint.x, y: lastPoint.y};
      }

      points += ` L${x} ${y}`;

      if (isLastPoint) {
        paths.push({firstPoint, lastPoint: {x, y}, color: currColor, points});
      }

      prevColor = currColor;
      lastPoint = {x, y};

      if (updateDataPoints) {
        this.datapoints.push({
          x,
          y,
          score: clampTo2Decimals(value.score),
          date: value.date,
        });
      }
    });

    return paths;
  }

  /**
   * Generates element's markup.
   * @return {!TemplateResult}
   * @private
   */
  // prettier-ignore
  generateTemplate_() {
    const paths = this.generatePath_(this.values_);
    const lastDataPoint = paths[paths.length - 1];
    const medianPaths = this.generatePath_(this.medians_, false);

    /* eslint-disable max-len,indent */
    const template = svg`
      <svg xmlns="http://www.w3.org/2000/svg"
          width="100%" height="130%" style="padding: ${this.padding_}px;">
        <defs>
          <filter id="hover-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000"
               flood-opacity="0.4"/>
          </filter>
          <linearGradient id="gradient-green" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(24,182,99)" stop-opacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-orange" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(251,140,0)" stop-opacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-red" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="rgb(229,57,53)" stop-opacity="0.2" />
          </linearGradient>
        </defs>
        <g transform="translate(0,${this.transformY_})">
          ${paths.map(({firstPoint, points, color}, i) => svg`
            <path class="gradient" stroke="none"
                d="${points} V ${this.height_ + this.scoreHeight_ / 2} H ${firstPoint.x} Z"
                fill="${this.fill ? `url(#gradient-${color})` : 'none'}" />
            <path d="${points}" class="path ${color}" style="fill:none" />
          `)}
          ${medianPaths.map(({points}) => {
            return svg`<path d="${points}" class="path dashed"
                             style="stroke-dasharray:4;stroke-dashoffset:0;"/>`;
          })}
          <line id="cursor" stroke-opacity="1" stroke-width="1"
                x1="-10000" x2="-10000" y1="0" y2="${this.height_}" />
          <circle cx="${lastDataPoint.lastPoint.x}"
                cy="${lastDataPoint.lastPoint.y}"
                r="${this.circleRadius_}" stroke-width="${this.stroke_}"
                class="${lastDataPoint.color}" style="fill:#fff" />
          <g id="score" transform="translate(-10000,-10000)" aria-hidden="true">
            <rect width="50" height="40" fill="#fff" rx="2" ry="2"
                  style="filter:url(#hover-shadow)"/>
            <text id="value" stroke="none" x="25" y="18"></text>
            <text id="date" stroke="none" x="3" y="32"></text>
          </g>
        </g>
      </svg>
      <div aria-live="assertive" class="sr-announcer"></div>`;

    return template;
  }

  /**
   * Determines Lighthouse pass/average/fail coloring based on value.
   * @param {number} val
   * @return {string}
   * @private
   */
  computeColorClass_(val) {
    // Match to Lighthouse rating. See https://goo.gl/Pz6xfR.
    let colorClass = "red";
    if (val >= 90) {
      colorClass = "green";
    } else if (val >= 50) {
      colorClass = "orange";
    }
    return colorClass;
  }

  /**
   * (Re)renders the line, gradient. Should be called when .values is changed.
   * @private
   */
  update_() {
    // Don't do work if no values yet.
    if (!this.values_.length) {
      return;
    }

    const rect = this.getBoundingClientRect();
    this.width_ = rect.width;
    this.height_ = rect.height;

    // Account for padding and diameter of data point circle.
    const circleDiameter = this.circleRadius_ * 2;
    this.width_ = this.width_ - this.padding_ - circleDiameter;
    this.height_ =
      this.height_ - this.padding_ - circleDiameter - this.scoreHeight_;

    render(this.generateTemplate_(), this);
    this.cursor_ = /** @type {!HTMLElement} */ (this.querySelector("#cursor"));
    this.score_ = /** @type {!HTMLElement} */ (this.querySelector("#score"));

    if (this.score_ !== null) {
      this.scoreValueText_ = /** @type {!HTMLElement} */ (this.score_.querySelector(
        "text#value",
      ));
      this.scoreDateText_ = /** @type {!HTMLElement} */ (this.score_.querySelector(
        "text#date",
      ));
    }
    this.announcer_ = /** @type {!HTMLElement} */ (this.querySelector(
      ".sr-announcer",
    ));

    // Animate the line draws by changing the length of the dash-offset.
    const paths = /** @type {!NodeList<!SVGPathElement>} */ (this.querySelectorAll(
      ".path:not(.dashed)",
    ));
    Array.from(paths).forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    // nb. this relies on side effects of generateTemplate_ which calls
    // generatePath_ and creates the datapoints array.
    this.setAttribute("aria-valuenow", this.datapoints.slice(-1)[0].score);

    if (this.fill) {
      window.requestAnimationFrame(() => {
        const gradients = this.getElementsByClassName("gradient");
        for (const gradient of gradients) {
          gradient.classList.add("fadein");
        }
      });
    }
  }
}

customElements.define("web-sparkline-chart", SparklineChart);
