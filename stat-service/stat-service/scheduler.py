from apscheduler.schedulers.background import BackgroundScheduler
from fedData import insert_latest_bond_data

sched = BackgroundScheduler(daemon=True)
sched.add_job(insert_latest_bond_data, 'interval', hours=12)


def start_scheduler():
    sched.start()
