import React, { FC, useState } from "react";
import { FightReportType } from "@/api/types";
import styles from "./fight-report.module.scss";
import { ItemDisplay } from "@/components/items";
import { FightReportTurns } from "./fight-report-turns";
import { Participants } from "./participants";
import { Button } from "../ui/button";

type FightReportDisplayProps = {
  report: FightReportType;
};

enum CurrentView {
  DEFAULT = "default",
  EXPANDED_LOGS = "expandedLogs",
  EXPANDED_STATS = "expandedStats",
  //TODO: expanded stats
}

export const FightReportDisplay: FC<FightReportDisplayProps> = ({ report }) => {
  const [currentView, setCurrentView] = useState<CurrentView>(
    CurrentView.DEFAULT
  );
  //TODO: later from localstorage

  const handleOnClickExpandLogsButton = () => {
    if (currentView !== CurrentView.EXPANDED_LOGS)
      setCurrentView(CurrentView.EXPANDED_LOGS);
    else setCurrentView(CurrentView.DEFAULT);
  };

  return (
    <div className={`${styles.fightReportWrapper} ${styles[currentView]}`}>
      <div className={styles.reportBaseDetails}>
        <div>
          <div>{report.status}</div>
          <div>Experience: {report.gainedExperience}</div>
          <div>Gold: {report.gainedGold}</div>
        </div>
        <div className={styles.lootDetails}>
          {report.loot.map((item) => (
            <div
              key={JSON.stringify(item.id)}
              className={styles.itemLootWrapper}
            >
              <ItemDisplay item={item} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.fightReportDetails}>
        <Participants characters={report.characters} enemies={report.enemies} />
      </div>

      <div className={styles.fightReportLogsWrapper}>
        <div className={styles.expandButtonWrapper}>
          <Button
            variant="success"
            onClick={() => handleOnClickExpandLogsButton()}
          >
            Battle logs
          </Button>
        </div>
        <FightReportTurns turns={report.turnsReports} />
      </div>
    </div>
  );
};
