export interface ICorrelation {
    requestId?: string;
    b3TraceId?: string;
    b3SpanId?: string;
    b3ParentSpanId?: string;
    b3Sampled?: string;
    b3flags?: string;
    otSpanContext?: string;
}