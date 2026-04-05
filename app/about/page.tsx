export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-[#eef3e7] mb-4">About Blutosec</h1>

      <p className="text-[#c0cdb7] mb-4">
        Blutosec is an educational cybersecurity platform designed for security analysts,
        incident responders, and threat hunters. The goal of this platform is to provide
        practical, real-world detection logic and queries that can be used across modern
        security tools such as Microsoft Sentinel, Defender, and other SIEM platforms.
      </p>

      <p className="text-[#c0cdb7] mb-4">
        This site focuses on detection engineering, threat hunting techniques, and
        operational security workflows to help defenders improve visibility, response and quick remediation.
      </p>

      <p className="text-[#c0cdb7]">
        All content is intended for educational and professional cybersecurity use.
      </p>
    </main>
  )
}