import {
  Html, Head, Body, Container, Section, Heading, Text, Hr, Preview
} from '@react-email/components'

interface HotLeadAlertProps {
  leadName: string
  leadEmail: string
  businessName?: string
  industry?: string
  readinessScore: number
  intentScore: number
  answers?: Record<string, string>
}

export default function HotLeadAlert({ leadName, leadEmail, businessName, industry, readinessScore, intentScore, answers }: HotLeadAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>{`🔥 Hot Lead: ${leadName} scored ${readinessScore}/100`}</Preview>
      <Body style={{ backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 600, margin: '40px auto', padding: '0 16px' }}>
          <Section style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: '32px', border: '2px solid #4F46E5' }}>
            <Text style={{ fontSize: 32, margin: '0 0 8px' }}>🔥</Text>
            <Heading style={{ color: '#0F172A', fontSize: 24, fontWeight: 700, margin: '0 0 16px' }}>
              Hot Lead Alert
            </Heading>

            <Section style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: 16, margin: '0 0 20px' }}>
              <Text style={{ color: '#334155', fontSize: 15, margin: '0 0 6px' }}><strong>Name:</strong> {leadName}</Text>
              <Text style={{ color: '#334155', fontSize: 15, margin: '0 0 6px' }}><strong>Email:</strong> {leadEmail}</Text>
              {businessName && <Text style={{ color: '#334155', fontSize: 15, margin: '0 0 6px' }}><strong>Business:</strong> {businessName}</Text>}
              {industry && <Text style={{ color: '#334155', fontSize: 15, margin: '0 0 6px' }}><strong>Industry:</strong> {industry}</Text>}
            </Section>

            <Section style={{ display: 'flex', gap: 16, margin: '0 0 20px' }}>
              <Section style={{ backgroundColor: '#4F46E5', borderRadius: 8, padding: '12px 20px', display: 'inline-block', marginRight: 12 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 800, margin: 0 }}>{readinessScore}</Text>
                <Text style={{ color: '#C7D2FE', fontSize: 11, margin: '2px 0 0' }}>Readiness Score</Text>
              </Section>
              <Section style={{ backgroundColor: '#EEF2FF', borderRadius: 8, padding: '12px 20px', display: 'inline-block' }}>
                <Text style={{ color: '#4F46E5', fontSize: 24, fontWeight: 800, margin: 0 }}>{intentScore}</Text>
                <Text style={{ color: '#6366F1', fontSize: 11, margin: '2px 0 0' }}>Intent Score</Text>
              </Section>
            </Section>

            {answers && Object.keys(answers).length > 0 && (
              <>
                <Heading as="h2" style={{ color: '#0F172A', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
                  Answers Summary
                </Heading>
                {Object.entries(answers).map(([qId, answer]) => (
                  <Text key={qId} style={{ color: '#64748B', fontSize: 13, margin: '0 0 4px' }}>
                    <strong>{qId}:</strong> {answer}
                  </Text>
                ))}
              </>
            )}

            <Hr style={{ borderColor: '#E2E8F0', margin: '20px 0' }} />
            <Text style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
              Act fast — this lead is ready to buy. Reply to their email or call within 24 hours.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
