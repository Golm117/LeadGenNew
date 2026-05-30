import {
  Html, Head, Body, Container, Section, Heading, Text, Button, Hr, Preview
} from '@react-email/components'

interface ResultEmailProps {
  name: string
  readinessScore: number
  intentBand: 'hot' | 'warm' | 'cold'
  insights: string[]
  bookingUrl?: string
  resultUrl: string
}

export default function ResultEmail({ name, readinessScore, intentBand, insights, bookingUrl, resultUrl }: ResultEmailProps) {
  const bandLabel = intentBand === 'hot' ? 'Strong Fit' : intentBand === 'warm' ? 'Growing Fit' : 'Early Stage'
  const ctaText = intentBand === 'hot' ? 'Book Your Free Strategy Call' : intentBand === 'warm' ? 'Request a Tailored Quote' : 'Join Our Newsletter'
  const ctaUrl = intentBand === 'hot' && bookingUrl ? bookingUrl : resultUrl

  return (
    <Html>
      <Head />
      <Preview>{`Your Custom Software Readiness Score: ${readinessScore}/100`}</Preview>
      <Body style={{ backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
          <Section style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '40px 32px', border: '1px solid #E2E8F0' }}>
            <Heading style={{ color: '#0F172A', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
              Hi {name},
            </Heading>
            <Text style={{ color: '#64748B', fontSize: 16, margin: '0 0 24px' }}>
              Here&apos;s your Custom Software Readiness Assessment result.
            </Text>

            {/* Score display */}
            <Section style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: '24px', textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ color: '#4F46E5', fontSize: 56, fontWeight: 800, margin: 0, lineHeight: '1' }}>
                {readinessScore}
              </Text>
              <Text style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
                out of 100 · {bandLabel}
              </Text>
            </Section>

            {/* Insights */}
            {insights.length > 0 && (
              <Section style={{ margin: '0 0 24px' }}>
                <Heading as="h2" style={{ color: '#0F172A', fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>
                  What this means for you:
                </Heading>
                {insights.map((insight, i) => (
                  <Text key={i} style={{ color: '#334155', fontSize: 15, margin: '0 0 8px', paddingLeft: 12, borderLeft: '3px solid #4F46E5' }}>
                    {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />

            {/* CTA */}
            <Section style={{ textAlign: 'center' }}>
              <Text style={{ color: '#0F172A', fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>
                {intentBand === 'hot' ? 'You\'re a strong candidate for custom software. Let\'s talk.' : intentBand === 'warm' ? 'Custom software could unlock real gains for your business.' : 'You\'re building the right foundation, and we\'ll be here when you\'re ready.'}
              </Text>
              <Button
                href={ctaUrl}
                style={{ backgroundColor: '#4F46E5', color: '#FFFFFF', borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 16, display: 'inline-block' }}
              >
                {ctaText}
              </Button>
            </Section>

            <Hr style={{ borderColor: '#E2E8F0', margin: '24px 0' }} />
            <Text style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center', margin: 0 }}>
              GOLM · General Operations and Logistics Management Inc.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
