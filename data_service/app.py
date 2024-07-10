import sched, time
from fedData import insert_latest_bond_data
s = sched.scheduler(time.time, time.sleep)


def job():
    insert_latest_bond_data()


def periodic_sched():
    job()
    s.enter(14400,1,periodic_sched)


s.enter(1,1,periodic_sched)
s.run()

