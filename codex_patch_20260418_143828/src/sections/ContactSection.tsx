import { siteContent } from "@/content/siteContent";
import { SectionFrame } from "@/components/SectionFrame";
import { CommandTerminal } from "@/components/CommandTerminal";

export function ContactSection() {
  return (
    <SectionFrame
      id="contact"
      index="05"
      heading={siteContent.contact.heading}
      description={siteContent.contact.description}
      className="section-contact"
      aside={
        <div className="contact-command-list">
          {siteContent.contact.commands.map((entry, index) => (
            <div key={entry.command}>
              <span className="contact-command-index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{entry.command}</strong>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      }
    >
      <CommandTerminal />
    </SectionFrame>
  );
}
